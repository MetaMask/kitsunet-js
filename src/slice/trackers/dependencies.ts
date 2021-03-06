import { register } from 'opium-decorators'

import { KsnEthQuery } from '../../ksn-eth-query'
import KitsunetBlockTracker from 'kitsunet-block-tracker'
import HttpProvider from 'ethjs-provider-http'
import PollingBlockTracker from 'eth-block-tracker'
import EthQuery from 'eth-query'
import Libp2p from 'libp2p'

export class TrackerFactory {
  @register(HttpProvider)
  createEthHttpProvider (@register('options')
                         options: any): HttpProvider | null {
    return options.bridge ? new HttpProvider(options.rpcUrl) : null
  }

  @register(PollingBlockTracker)
  createPollingBlockProvider (@register('options')
                              options: any,
                              provider: HttpProvider): PollingBlockTracker | null {
    return options.bridge ? new PollingBlockTracker({ provider }) : null
  }

  @register(EthQuery)
  createEthQuery (@register('options')
                  options: any,
                  provider: HttpProvider): EthQuery | null {
    return options.bridge ? new KsnEthQuery(provider) : null
  }

  @register()
  createKitsunetBlockTracker (node: Libp2p,
                              blockTracker: PollingBlockTracker,
                              ethQuery: EthQuery): KitsunetBlockTracker {
    return new KitsunetBlockTracker({ node, blockTracker, ethQuery })
  }
}
