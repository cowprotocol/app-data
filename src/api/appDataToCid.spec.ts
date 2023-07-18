import { appDataToCid, appDataToCidLegacy } from './appDataToCid'
import {
  APP_DATA_HEX,
  APP_DATA_HEX_LEGACY,
  APP_DATA_DOC,
  CID,
  CID_LEGACY,
  APP_DATA_STRING,
  APP_DATA_STRING_2,
  CID_2,
  APP_DATA_HEX_2,
} from '../mocks'

import fetchMock from 'jest-fetch-mock'

beforeEach(() => {
  fetchMock.resetMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('appDataToCid', () => {
  test('Happy path with fullAppData string', async () => {
    // when
    const result = await appDataToCid(APP_DATA_STRING)

    // then
    expect(result).not.toBeFalsy()
    expect(result).toEqual({ cid: CID, appDataHex: APP_DATA_HEX })
  })

  test('Happy path with appData doc ', async () => {
    // when
    const result = await appDataToCid(APP_DATA_DOC)

    // then
    expect(result).not.toBeFalsy()
    expect(result).toEqual({ cid: CID, appDataHex: APP_DATA_HEX })
  })

  test('Happy path with appData doc 2 ', async () => {
    // when
    const result = await appDataToCid(APP_DATA_STRING_2)

    // then
    expect(result).not.toBeFalsy()
    expect(result).toEqual({ cid: CID_2, appDataHex: APP_DATA_HEX_2 })
  })

  test('Throws with invalid appDoc', async () => {
    // given
    const doc = {
      ...APP_DATA_DOC,
      metadata: { quote: { sellAmount: 'fsdfas', buyAmount: '41231', version: '0.1.0' } },
    }

    // when
    const promise = appDataToCid(doc)

    // then
    await expect(promise).rejects.toThrow('Invalid appData provided')
  })
})

describe('appDataToCidLegacy', () => {
  test('Happy path', async () => {
    // when
    const result = await appDataToCidLegacy(APP_DATA_DOC)
    // then
    expect(result).not.toBeFalsy()
    expect(result).toEqual({ cid: CID_LEGACY, appDataHex: APP_DATA_HEX_LEGACY })
  })

  test('Throws with invalid appDoc', async () => {
    // given
    const doc = {
      ...APP_DATA_DOC,
      metadata: { quote: { sellAmount: 'fsdfas', buyAmount: '41231', version: '0.1.0' } },
    }
    // when
    const promise = appDataToCidLegacy(doc)
    // then
    await expect(promise).rejects.toThrow('Invalid appData provided')
  })
})
