'use strict'

const EE = require('safe-event-emitter')

class BaseTracker extends EE {
  /**
 * Stop tracking the provided slices
 *
 * @param {Set<SliceId>|SliceId} slices - the slices to stop tracking
 */
  async untrack (slices) {
    throw new Error('not implemented!')
  }

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>|SliceId} slices - a slice or an Set of slices to track
   */
  async track (slices) {
    throw new Error('not implemented!')
  }

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  async isTracking (slice) {
    throw new Error('not implemented!')
  }

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  async publish (slice) {
    throw new Error('not implemented!')
  }

  async start () {
    throw new Error('not implemented!')
  }

  async stop () {
    throw new Error('not implemented!')
  }
}

module.exports = BaseTracker
