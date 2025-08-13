import { describe, test } from 'node:test'
import assert from 'node:assert'
import nock from 'nock'
import { DEFAULT_IPFS_READ_URI } from '../consts'
import { fetchDocFromCid } from './fetchDocFromCid'

describe('fetchDocFromCid', () => {
  test('Valid IPFS appData from CID', async () => {
    // given
    const validSerializedCid = 'QmZZhNnqMF1gRywNKnTPuZksX7rVjQgTT3TJAZ7R6VE3b2'
    const expected = {
      appCode: 'CowSwap',
      metadata: { referrer: { address: '0x1f5B740436Fc5935622e92aa3b46818906F416E9', version: '0.1.0' } },
      version: '0.1.0',
    }
    // Setup nock interceptor
    const ipfsUrl = new URL(DEFAULT_IPFS_READ_URI)
    nock(`${ipfsUrl.protocol}//${ipfsUrl.host}`).get(`${ipfsUrl.pathname}/${validSerializedCid}`).reply(200, expected)

    // when
    const appDataDocument = await fetchDocFromCid(validSerializedCid)

    // then
    assert.deepStrictEqual(appDataDocument, expected)
  })
})
