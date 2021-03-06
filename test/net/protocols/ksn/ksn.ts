/* eslint-env mocha */

'use strict'

import 'mocha'
import { expect } from 'chai'
import Block from 'ethereumjs-block'

import { EthChain } from '../../../../src/blockchain'
import proto from '../../../../src/net/protocols/kitsunet/proto'

import {
  IPeerDescriptor,
  INetwork,
  IProtocol,
  KsnProtocol,
  Libp2pPeer,
  Libp2pNode,
  MsgType,
  ResponseStatus,
  NodeType
} from '../../../../src/net'

import { Identify as IdentifyHandler } from '../../../../src/net/protocols/kitsunet/handlers'

import * as jsonBlock from '../../../fixtures/block.json'
import BN from 'bn.js'
import fromRpc = require('ethereumjs-block/from-rpc')
const { Kitsunet } = proto
const block: Block = new Block(fromRpc(jsonBlock.block))

describe('Ksn protocol', () => {
  describe('setup', () => {
    let ksnProtocol
    beforeEach(() => {
      ksnProtocol = new KsnProtocol({} as Libp2pPeer,
                                    {} as Libp2pNode,
                                    {} as EthChain)
    })

    it('should have correct protocol id', () => {
      expect(ksnProtocol.id).to.eql('ksn')
    })

    it('should have correct protocol versions', () => {
      expect(ksnProtocol.versions).to.eql(['1.0.0'])
    })
  })

  describe('handlers - handle', () => {
    let ksnProtocol
    beforeEach(() => {
      ksnProtocol = new KsnProtocol({} as Libp2pPeer,
                                    {} as Libp2pNode,
                                    { getLatestBlock: async () => block } as any)
    })

    it('should handle Identify request', async () => {
      const identify = {
        type: MsgType.IDENTIFY,
        status: ResponseStatus.OK,
        payload: {
          identify: {
            versions: ['1.0.0'],
            userAgent: 'ksn-client',
            nodeType: NodeType.NODE,
            latestBlock: new BN(0).toBuffer()
            // sliceIds: this.networkProvider.getSliceIds()
          }
        }
      }

      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield Kitsunet.encode(identify)
        }
      }

      for await (const msg of ksnProtocol.receive(source)) {
        expect(msg.payload).to.deep.eq(identify.payload)
      }
    })

    it('should handle Ping request', async () => {
      const ping = {
        type: MsgType.PING,
        status: ResponseStatus.OK
      }

      const source: AsyncIterable<any> = {
        [Symbol.asyncIterator]: async function* () {
          yield Kitsunet.encode(ping)
        }
      }

      for await (const msg of ksnProtocol.receive(source)) {
        expect(msg).to.deep.eq(ping)
      }
    })
  })

  describe('handles - request', () => {
    let sendHandler: Function | undefined
    let receiveHandler: (msg: any) => AsyncIterable<any> | undefined

    const networkProvider: any = {
      send: async function <T, U> (msg: T, protocol?: IProtocol<any>, peer?: any): Promise<any> {
        return sendHandler ? sendHandler(msg) : msg
      },
      receive: async function* <T, U>(readable: AsyncIterable<T>): AsyncIterable<U | U[]> {
        return receiveHandler ? receiveHandler(readable) : receiveHandler
      }
    }

    let ksnProtocol
    beforeEach(() => {
      ksnProtocol = new KsnProtocol({} as Libp2pPeer, networkProvider, { getLatestBlock: async () => block } as any)
    })

    it('should send Identify request', async () => {
      const identifyMsg = {
        type: MsgType.IDENTIFY,
        status: ResponseStatus.OK,
        payload: {
          identify: {
            versions: ['1.0.0'],
            userAgent: 'ksn-client',
            nodeType: NodeType.NODE,
            latestBlock: block.header.number,
            sliceIds: []
            // sliceIds: this.networkProvider.getSliceIds()
          }
        }
      }

      sendHandler = (msg) => {
        expect(msg).to.eql(Kitsunet.encode({ type: MsgType.IDENTIFY }))
        return Kitsunet.encode(identifyMsg)
      }

      const identify = new IdentifyHandler(ksnProtocol, {} as IPeerDescriptor<any>)
      const res = await identify.send()
      expect(res).to.eql(identifyMsg.payload.identify)
    })
  })
})
