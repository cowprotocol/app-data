import { describe, test } from 'node:test'
import assert from 'node:assert'
import nock from 'nock'
import { DEFAULT_IPFS_WRITE_URI } from '../consts'
import { APP_DATA_DOC_CUSTOM } from '../mocks'
import { generateAppDataDoc } from './generateAppDataDoc'
import { uploadMetadataDocToIpfsLegacy } from './uploadMetadataDocToIpfsLegacy'

const HTTP_STATUS_OK = 200
const HTTP_STATUS_INTERNAL_ERROR = 500

const IPFS_HASH = 'QmU4j5Y6JM9DqQ6yxB6nMHq4GChWg1zPehs1U7nGPHABRu'
const APP_DATA_HEX = '0x5511c4eac66ab272d9a6ab90e07977d00ff7375fc4dc1038a3c05b2c16ca0b74'

const PINATA_API_KEY = 'apikey'
const PINATA_API_SECRET = 'apiSecret'

describe('uploadMetadataDocToIpfsLegacy', () => {
  test('Fails without passing credentials', async () => {
    // given
    const appDataDoc = await generateAppDataDoc({
      metadata: {
        referrer: APP_DATA_DOC_CUSTOM.metadata.referrer,
      },
    })

    // when & then
    await assert.rejects(uploadMetadataDocToIpfsLegacy(appDataDoc, {}), { message: 'You need to pass IPFS api credentials.' })
  })

  test('Fails with wrong credentials', async () => {
    // given
    nock(DEFAULT_IPFS_WRITE_URI)
      .post(`/pinning/pinJSONToIPFS`)
      .reply(HTTP_STATUS_INTERNAL_ERROR, { error: { details: 'IPFS api keys are invalid' } })

    const appDataDoc = await generateAppDataDoc({})

    // when & then
    await assert.rejects(
      uploadMetadataDocToIpfsLegacy(appDataDoc, {
        pinataApiKey: PINATA_API_KEY,
        pinataApiSecret: PINATA_API_SECRET,
      }),
      { message: 'IPFS api keys are invalid' },
    )
  })

  test('Uploads to IPFS', async () => {
    // given
    const appDataDoc = await generateAppDataDoc({
      metadata: { referrer: APP_DATA_DOC_CUSTOM.metadata.referrer },
    })

    nock(DEFAULT_IPFS_WRITE_URI)
      .post(`/pinning/pinJSONToIPFS`)
      .matchHeader('Content-Type', 'application/json')
      .matchHeader('pinata_api_key', PINATA_API_KEY)
      .matchHeader('pinata_secret_api_key', PINATA_API_SECRET)
      .reply(HTTP_STATUS_OK, { IpfsHash: IPFS_HASH })

    // when
    const uploadResult = await uploadMetadataDocToIpfsLegacy(appDataDoc, {
      pinataApiKey: PINATA_API_KEY,
      pinataApiSecret: PINATA_API_SECRET,
    })

    // then
    assert.deepStrictEqual(uploadResult, {
      appData: APP_DATA_HEX,
      cid: IPFS_HASH,
    })
  })
})
