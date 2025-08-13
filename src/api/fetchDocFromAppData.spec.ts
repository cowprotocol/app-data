import { describe, test } from 'node:test'
import assert from 'node:assert'

import nock from 'nock'
import { DEFAULT_IPFS_READ_URI } from '../consts'
import {
  APP_DATA_DOC_CUSTOM,
  APP_DATA_HEX_LEGACY,
  CID_LEGACY,
  HTTP_STATUS_INTERNAL_ERROR,
  HTTP_STATUS_OK,
} from '../mocks'
import { fetchDocFromAppDataHex, fetchDocFromAppDataHexLegacy } from './fetchDocFromAppData'

describe('fetchDocFromAppData', () => {
  test('Decodes appData', async () => {
    // given
    const ipfsUrl = new URL(DEFAULT_IPFS_READ_URI)
    nock(`${ipfsUrl.protocol}//${ipfsUrl.host}`)
      .get(`${ipfsUrl.pathname}/${CID_LEGACY}`)
      .reply(HTTP_STATUS_OK, JSON.stringify(APP_DATA_DOC_CUSTOM))

    // when
    const appDataDoc = await fetchDocFromAppDataHexLegacy(APP_DATA_HEX_LEGACY)

    // then
    assert.deepStrictEqual(appDataDoc, APP_DATA_DOC_CUSTOM)
  })

  test('Throws with wrong hash format', async () => {
    // given
    const ipfsUrl = new URL(DEFAULT_IPFS_READ_URI)
    nock(`${ipfsUrl.protocol}//${ipfsUrl.host}`).get(/.*/).reply(HTTP_STATUS_INTERNAL_ERROR, JSON.stringify({}))

    // when & then
    await assert.rejects(fetchDocFromAppDataHex('invalidHash'), /Error decoding AppData:/)
  })
})
