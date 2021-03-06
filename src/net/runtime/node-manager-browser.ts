'use strict'

import { Node } from '../node'
import { register } from 'opium-decorators'
import { EventEmitter } from 'events'
import { IPeerDescriptor } from '../interfaces'
import { Libp2pNode } from '../stacks/libp2p'
import { KsnProtocol, EthProtocol } from '../protocols'

/**
 * A node manager to start/stop nodes as well
 * as subscribed to discovery events
 *
 * @fires NodeManager#kitsunet:peer:connected - fires on new connected peer
 * @fires NodeManager#kitsunet:peer:disconnected - fires when a peer disconnects
 */
@register('node-manager')
export class NodeManager<T extends IPeerDescriptor<any>> extends EventEmitter {
  @register('nodes')
  static createNodes<U extends Node<any>> (libp2pNode: Libp2pNode): Node<U>[] {
    return [libp2pNode] as unknown as Node<U>[]
  }

  /**
   * Create a protocol registry
   */
  @register('protocol-registry')
  static protocolRegistry () {
    return [{
      constructor: KsnProtocol,
      cap: {
        id: 'ksn',
        versions: ['1.0.0']
      }
    }, {
      constructor: EthProtocol,
      cap: {
        id: 'eth',
        versions: ['62', '63']
      }
    }]
  }

  private connectedHandler = (...args: any[]) =>
    this.emit('kitsunet:peer:connected', ...args)

  private disconnectedHandler = (...args: any[]) =>
    this.emit('kitsunet:peer:disconnected', ...args)

  nodes: Node<T>[] = []
  constructor (@register('nodes') nodes: Node<T>[]) {
    super()
    this.nodes = nodes
  }

  async start (): Promise<void> {
    for (const node of this.nodes) {
      node.on('kitsunet:peer:connected', this.connectedHandler)
      node.on('kitsunet:peer:disconnected', this.disconnectedHandler)
      await node.start()
    }
  }

  async stop (): Promise<void> {
    for (const node of this.nodes) {
      node.off('kitsunet:peer:connected', this.connectedHandler)
      node.off('kitsunet:peer:disconnected', this.disconnectedHandler)
      await node.stop()
    }
  }
}
