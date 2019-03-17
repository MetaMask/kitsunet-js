/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const promisify = require('promisify-this')
const { MemoryDatastore } = require('interface-datastore')
const { Slice } = require('../src/slice')
const { Store } = require('../src/stores')
const { SliceStore } = require('../src/stores')

const loadFixture = require('aegir/fixtures')
const accountSliceData = loadFixture('test/fixtures/account.json')

describe('slice store', () => {
  const slice = new Slice(JSON.parse(accountSliceData).result)
  const datastore = promisify(new MemoryDatastore())
  const store = new Store(datastore)
  const sliceStore = new SliceStore(store)

  it('should store and retrieve slice', async () => {
    sliceStore.storeSlice(slice)
    const s = await sliceStore.getSliceById(slice)
    expect(s).to.be.deep.eq(slice)
  })

  it('should retrieve slice')
})
