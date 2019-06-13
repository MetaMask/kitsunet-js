'use strict'

import Block, { Header } from 'ethereumjs-block'
import { register } from 'opium-decorators'
import { EthChain } from '../blockchain/eth-chain'
import { EventEmitter as EE } from 'events'
import { PeerManager, Peer, EthProtocol } from '../net'
import { IBlockchain } from '../blockchain'

import Debug from 'debug'
import BN from 'bn.js'
const debug = Debug('kitsunet:downloader:download-manager')

const MAX_PEERS: number = 25
const MAX_HEADERS: number = 128
const DEFAUL_DOWNLOAD_INTERVAL: number = 1000 * 5

@register('download-manager')
export class DownloadManager extends EE {
  peers: Map<string, Peer> = new Map()
  syncInterval: NodeJS.Timeout | undefined
  maxPeers: number = MAX_PEERS
  downloadInterval: number = DEFAUL_DOWNLOAD_INTERVAL

  constructor (@register('peer-manager')
               public peerManager: PeerManager,
               @register(EthChain)
               public chain: IBlockchain) {
    super()
  }

  async latest (ethProto: EthProtocol<any>): Promise<Header | undefined> {
    return new Promise(async (resolve, reject) => {
      const status = await ethProto.getStatus()
      for await (const header of ethProto.getHeaders(status.bestHash, 1)) {
        debug(`got header ${(header[0] as unknown as Header).hash().toString('hex')}`)
        return resolve(header[0] as unknown as Header)
      }
      debug('no header resolved')
      reject('no header resolved')
    })
  }

  async download (peer: Peer): Promise<void> {
    if (!this.peers.has(peer.id) && this.peers.size <= this.maxPeers) {
      this.peers.set(peer.id, peer)
      const ethProto: EthProtocol<any> | undefined = peer.protocols.get('eth') as EthProtocol<any>
      if (ethProto) {
        let blockNumber: number = 0
        const block: Block | undefined = await this.chain.getLatestHeader()
        if (block) {
          blockNumber = block.header.number
        }

        try {
          const remoteHeader: Header | undefined = await this.latest(ethProto)
          if (remoteHeader) {
            const remoteNumber: number = Number(`0x${remoteHeader.number.toString('hex')}`)
            blockNumber++
            while (blockNumber <= remoteNumber) {
              for await (const headers of ethProto.getHeaders(new BN(blockNumber), MAX_HEADERS)) {
                debug(`got headers: `)
                debug(headers.forEach(h => debug(h.number.toString('hex'))))
                await this.chain.putHeaders(headers)
                blockNumber += headers.length
              }
            }
          }
        } catch (err) {
          debug(err)
        } finally {
          this.peers.delete(peer.id)
        }
      }
    }
  }

  /**
   * Start sync
   */
  async start (): Promise<void> {
    this.syncInterval = setInterval(
      () => {
        const peer = this.peerManager.getRandomByCapability({
          id: 'eth',
          versions: ['63']
        })

        if (peer) {
          return this.download(peer)
        }
      },
      this.downloadInterval)
  }

  /**
   * Stop sync
   */
  async stop (): Promise<void> {
    if (this.syncInterval) clearInterval(this.syncInterval)
  }
}
