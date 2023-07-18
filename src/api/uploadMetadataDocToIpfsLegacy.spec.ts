import { DEFAULT_IPFS_WRITE_URI } from '../consts'
import { generateAppDataDoc } from './generateAppDataDoc'
import { APP_DATA_DOC_CUSTOM } from '../mocks'
import { uploadMetadataDocToIpfsLegacy } from './uploadMetadataDocToIpfsLegacy'

const HTTP_STATUS_OK = 200
const HTTP_STATUS_INTERNAL_ERROR = 500

const IPFS_HASH = 'QmUbsYUqP4DXDvXDipKDG6hKhKnb6dADMeBiHHYJiizr25'
const APP_DATA_HEX = '0x5d0c585e073ac95728f9cdb05f640be38416ba93c493e842e52e1cf4514488fa'

const PINATA_API_KEY = 'apikey'
const PINATA_API_SECRET = 'apiSecret'

beforeEach(() => {
  fetchMock.resetMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('uploadMetadataDocToIpfsLegacy', () => {
  test('Fails without passing credentials', async () => {
    // given
    const appDataDoc = await generateAppDataDoc({
      metadata: {
        referrer: APP_DATA_DOC_CUSTOM.metadata.referrer,
      },
    })
    // when
    const promise = uploadMetadataDocToIpfsLegacy(appDataDoc, {})
    // then
    await expect(promise).rejects.toThrow('You need to pass IPFS api credentials.')
  })

  test('Fails with wrong credentials', async () => {
    // given
    fetchMock.mockResponseOnce(JSON.stringify({ error: { details: 'IPFS api keys are invalid' } }), {
      status: HTTP_STATUS_INTERNAL_ERROR,
    })
    const appDataDoc = await generateAppDataDoc({})
    // when
    const promise = uploadMetadataDocToIpfsLegacy(appDataDoc, {
      pinataApiKey: PINATA_API_KEY,
      pinataApiSecret: PINATA_API_SECRET,
    })
    // then
    await expect(promise).rejects.toThrow('IPFS api keys are invalid')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  test('Uploads to IPFS', async () => {
    // given
    fetchMock.mockResponseOnce(JSON.stringify({ IpfsHash: IPFS_HASH }), { status: HTTP_STATUS_OK })
    const appDataDoc = await generateAppDataDoc({
      metadata: { referrer: APP_DATA_DOC_CUSTOM.metadata.referrer },
    })

    // when
    const uploadResult = await uploadMetadataDocToIpfsLegacy(appDataDoc, {
      pinataApiKey: PINATA_API_KEY,
      pinataApiSecret: PINATA_API_SECRET,
    })

    // then
    expect(uploadResult).toEqual({
      appData: APP_DATA_HEX,
      cid: IPFS_HASH,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(DEFAULT_IPFS_WRITE_URI + '/pinning/pinJSONToIPFS', {
      body: JSON.stringify({ pinataContent: appDataDoc, pinataMetadata: { name: 'appData' } }),
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
      method: 'POST',
    })
  })
})
