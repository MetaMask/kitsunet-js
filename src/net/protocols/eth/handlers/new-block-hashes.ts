'use strict'

import BN from 'bn.js'
import { EthHandler } from '../eth-handler'
import { EthProtocol } from '../eth-protocol'
import { IPeerDescriptor } from '../../../interfaces'
import { ETH } from 'ethereumjs-devp2p'

export class NewBlockHashes<P> extends EthHandler<P> {
  constructor (networkProvider: EthProtocol<P>,
               peer: IPeerDescriptor<P>) {
    super('NewBlockHashes', ETH.MESSAGE_CODES.NEW_BLOCK_HASHES, networkProvider, peer)
  }

  async handle<T, U> (hashes: T[]): Promise<U[][]> {
    // emit it on the provider
    const announced = hashes.map(hn => [hn[0], new BN(hn[1])])
    this.networkProvider.emit('new-block-hashes', announced)
    return announced
  }

  async request<T, U> (hashes: T[]): Promise<U> {
    return this.send(hashes.map(hn => [hn[0], hn[1].toArrayLike(Buffer)]))
  }
}