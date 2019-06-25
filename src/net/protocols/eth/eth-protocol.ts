'use strict'

import * as Handlers from './handlers'
import Block from 'ethereumjs-block'
import { BaseProtocol } from '../../base-protocol'
import { IEthProtocol, BlockBody, Status } from './interfaces'
import { IPeerDescriptor, Node, IEncoder } from '../..'
import { EthChain } from '../../../blockchain'
import { EthHandler } from './eth-handler'
import { RlpEncoder } from './rlp-encoder'
import { ETH } from 'ethereumjs-devp2p'
import Debug from 'debug'
import BN from 'bn.js'

const debug = Debug(`kitsunet:eth-proto`)

export const MSG_CODES = ETH.MESSAGE_CODES

export class Deferred<T> {
  promise: Promise<T>
  resolve: (...args: any[]) => any = Function
  reject: (...args: any[]) => any = Function
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export class EthProtocol<P extends IPeerDescriptor<any>> extends BaseProtocol<P> implements IEthProtocol {
  protocolVersion: number
  handlers: { [key: number]: EthHandler<P> }
  private _status: Deferred<Status> = new Deferred<Status>()

  async getStatus (): Promise<Status> {
    return this._status.promise
  }

  async setStatus (status: Status): Promise<void> {
    return this._status.resolve(status)
  }

  /**
   * Construct an Ethereum protocol
   *
   * @param blockChain - the blockchain to use for this peer
   * @param peer - the peer descriptor for this peer
   * @param networkProvider - the network provider
   * @param encoder - an encoder to use with the peer
   */
  constructor (peer: P,
               networkProvider: Node<P>,
               public ethChain: EthChain,
               encoder: IEncoder = new RlpEncoder(networkProvider.type)) {
    super(peer, networkProvider, encoder)
    this.protocolVersion = Math.max.apply(Math, this.versions.map(v => Number(v)))

    this.handlers = {}
    Object.keys(Handlers).forEach((handler) => {
      const h: EthHandler<P> = Reflect.construct(Handlers[handler], [this, this.peer])
      this.handlers[h.id] = h
    })
  }

  get id (): string {
    return 'eth'
  }

  get versions (): string[] {
    return [
      ETH.eth62.version.toString(),
      ETH.eth63.version.toString()
    ]
  }

  async *receive<T, U> (readable: AsyncIterable<T>): AsyncIterable<U | U[] | null> {
    for await (const msg of super.receive<T, any[]>(readable)) {
      if (!msg) return
      const code: ETH.MESSAGE_CODES = msg.shift() as ETH.MESSAGE_CODES
      if (!this.handlers[code]) {
        debug(`unsupported method - ${MSG_CODES[code]}`)
        return
      }

      const res = await this.handlers[code].handle(...msg)
      if (!res) yield null
      for await (const encoded of this.encoder!.encode(res)) {
        yield encoded
      }
    }
  }

  async send<T, U> (msg: T): Promise<U | U[] | void | null> {
    return super.send(msg, this)
  }

  /**
   * Get block headers
   *
   * @param block {number | Buffer | BN} - the block for which to get the header
   * @param max {number} - max number of headers to download from peer
   * @param skip {number} - skip a number of headers
   * @param reverse {boolean} - in reverse order
   */
  async *getHeaders (block: number | Buffer | BN,
                     max: number,
                     skip?: number,
                     reverse?: boolean): AsyncIterable<Block.Header[]> {
    yield new Promise<Block.Header[]>(async (resolve) => {
      this.handlers[MSG_CODES.BLOCK_HEADERS].on('message', (headers) => {
        resolve(headers)
      })
      await this.handlers[MSG_CODES.GET_BLOCK_HEADERS].send(block, max, skip, reverse)
    })
  }

  /**
   * Get block bodies for block hashes
   *
   * @param hashes {Buffer[] | string[]} - block hashes for which to get the bodies
   */
  async *getBlockBodies (hashes: Buffer[] | string[]): AsyncIterable<BlockBody[]> {
    yield new Promise<BlockBody[]>(async (resolve) => {
      this.handlers[MSG_CODES.BLOCK_BODIES].on('message', (bodies) => {
        resolve(bodies)
      })
      const bufHashes = (hashes as any).map(h => Buffer.isBuffer(h) ? h : Buffer.from(h))
      await this.handlers[MSG_CODES.GET_BLOCK_BODIES].send(bufHashes)
    })
  }

  /**
   * Notify remote peer of new hashes
   *
   * @param hashes {Buffer[] | string[]} - array of new hashes to notify the peer
   */
  sendNewHashes (hashes: string[] | Buffer[]): Promise<void> {
    return this.handlers[MSG_CODES.NEW_BLOCK_HASHES].send(hashes)
  }

  /**
   * Perform protocol handshake. In the case of ETH protocol,
   * it sends the `Status` message.
   */
  async handshake (): Promise<void> {
    this.handlers[MSG_CODES.STATUS].send(
      this.protocolVersion,
      this.ethChain.common.networkId(),
      await this.ethChain.getBlocksTD(),
      (await this.ethChain.getBestBlock() as any).hash(),
      this.ethChain.genesis().hash
    )

    // wait for status to get resolved
    await this.getStatus()
  }
}
