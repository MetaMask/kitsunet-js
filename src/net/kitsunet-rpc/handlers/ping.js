'use strict'

const BaseHandler = require('./base')
const { MsgType, Status } = require('../proto').Kitsunet

class Ping extends BaseHandler {
  constructor (rpcEngine, peerInfo) {
    super('ping', MsgType.PING, rpcEngine, peerInfo)
  }

  async handle () {
    return {
      type: MsgType.PING,
      status: Status.OK
    }
  }

  async request () {
    await this.sendRequest({
      type: MsgType.PING
    })

    return true
  }
}

module.exports = Ping
