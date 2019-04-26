'use strict'

import { register } from 'opium-decorator-resolvers'

import Libp2p from 'libp2p'
import PeerInfo from 'peer-info'
import toIterator from 'pull-stream-to-async-iterator'
import pull from 'pull-stream'
import pullPushable from 'pull-pushable'
import { Node, IProtocol, NodeType, Peer } from '../interfaces'
import { Libp2pPeer } from './libp2p-peer'
import debug from 'debug'

@register()
export class Libp2pNode implements Node<PeerInfo>, Peer<PeerInfo> {
  get peer (): PeerInfo {
    return this.peerInfo
  }

  get id (): string {
    return this.peerInfo.id.toB58String()
  }

  get addrs (): Set<string> {
    return new Set(this.peerInfo.multiaddrs.map((a) => a.toString()))
  }

  get type (): NodeType {
    return NodeType.LIBP2P
  }

  peers: Map<string, Peer<PeerInfo>> = new Map()
  protocols: Map<string, IProtocol<PeerInfo>> = new Map()
  constructor (private peerInfo: PeerInfo,
               @register() private node: Libp2p,
               @register() private protocolRegistry: Set<IProtocol<PeerInfo>>) {
    protocolRegistry.forEach((protocol: IProtocol<PeerInfo>) => {
      const proto: IProtocol<PeerInfo> = protocol.createProtocol(this)
      this.protocols.set(proto.id, proto)
      this.mount(protocol)
    })

    node.on('peer:connected', (peer: PeerInfo) => {
      let protos: Map<string, IProtocol<PeerInfo>> = new Map()
      protocolRegistry.forEach((protocol: IProtocol<PeerInfo>) => {
        protos.set(protocol.codec, protocol.createProtocol(this))
      })

      const libp2pPeer: Libp2pPeer = new Libp2pPeer(peer, protos)
      this.peers.set(libp2pPeer.id, libp2pPeer)
    })
  }

  mount (protocol: IProtocol<PeerInfo>): void {
    this.node.handle(protocol.codec, async (codec: string, conn: any) => {
      return this.handleIncoming(codec, promisify(conn))
    })
  }

  unmount (protocol: IProtocol<PeerInfo>): void {
    this.node.unhandle(protocol.id)
  }

  private async handleIncoming (id: string, conn: any) {
    const peerInfo: PeerInfo = await conn.getPeerInfo()
    const peer: Libp2pPeer | undefined = this.peers.get(peerInfo.id.toB58String())
    if (!peer) {
      return debug(`unknown peer ${peerInfo.id.toB58String()}`)
    }

    const protocol: IProtocol<PeerInfo> | undefined = peer.protocols.get(id)
    if (protocol) {
      return protocol.handle(toIterator(conn))
    }
  }

  async send<T extends Buffer, U> (msg: T,
                                   protocol: IProtocol<PeerInfo>,
                                   peer?: PeerInfo): Promise<U | undefined> {
    if (peer) {
      const conn = await this.node.dialProtocol(peer, protocol.codec)
      return new Promise((resolve, reject) => {
        pull(
          pull.values(msg),
          conn,
          pull.collect((err: Error, values: U) => {
            if (err) return reject(err)
            resolve(values)
          }))
      })
    }
    return
  }

  handle<T extends AsyncIterable<T>> (readable: T): void {
    throw new Error('Method not implemented!')
  }

  /**
   * Create a two way stream with remote
   *
   * @param readable - an async iterable to stream from
   * @returns - an async iterator to pull from
   */
  async *stream<T extends AsyncIterable<T & Buffer>, U> (readable: T,
                                                         protocol: IProtocol<PeerInfo>,
                                                         peer?: PeerInfo): AsyncIterator<U> {
    if (peer) {
      const conn = await this.node.dial(peer, protocol.codec)
      const pushable = pullPushable()
      for await (const msg of readable) {
        pushable.push(msg)
      }

      pull(
        pushable,
        conn,
        pull.drain(function* (msg: T) {
          yield msg
        }))

    }
  }

  async start () {
    await this.node.start()
    this.addrs.forEach((ma) => {
      console.log('libp2p listening on', ma.toString())
    })
  }

  async stop () {
    await this.node.stop()
  }
}
