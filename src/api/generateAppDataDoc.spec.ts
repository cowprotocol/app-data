import fetchMock from 'jest-fetch-mock'
import { generateAppDataDoc } from './generateAppDataDoc'
import { APP_DATA_DOC_CUSTOM, APP_DATA_DOC } from '../mocks'

beforeEach(() => {
  fetchMock.resetMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('generateAppDataDoc', () => {
  test('Creates appDataDoc with empty metadata ', async () => {
    // when
    const appDataDoc = await generateAppDataDoc({})
    // then
    expect(appDataDoc).toEqual(APP_DATA_DOC)
  })

  test('Creates appDataDoc with custom metadata ', async () => {
    // given
    const params = {
      appDataParams: {
        environment: APP_DATA_DOC_CUSTOM.environment,
      },
      metadataParams: {
        referrerParams: APP_DATA_DOC_CUSTOM.metadata.referrer,
        quoteParams: APP_DATA_DOC_CUSTOM.metadata.quote,
      },
    }
    // when
    const appDataDoc = await generateAppDataDoc(params)
    // then
    expect(appDataDoc).toEqual(APP_DATA_DOC_CUSTOM)
  })
})
