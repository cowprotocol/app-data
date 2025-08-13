import { describe, test } from 'node:test'
import assert from 'node:assert'

import { APP_DATA_HEX, APP_DATA_HEX_LEGACY, CID, CID_LEGACY } from '../mocks'
import { appDataHexToCid, appDataHexToCidLegacy } from './appDataHexToCid'

describe('appDataHexToCid', () => {
  test('Happy path', async () => {
    // when
    const decodedAppDataHex = await appDataHexToCid(APP_DATA_HEX)
    // then
    assert.strictEqual(decodedAppDataHex, CID)
  })

  test('Throws with wrong hash format ', async () => {
    // when
    const promise = appDataHexToCid('invalidHash')
    // then
    await assert.rejects(promise)
  })
})

describe('appDataHexToCidLegacy', () => {
  test('Happy path', async () => {
    // when
    const decodedAppDataHex = await appDataHexToCidLegacy(APP_DATA_HEX_LEGACY)
    // then
    assert.strictEqual(decodedAppDataHex, CID_LEGACY)
  })

  test('Throws with wrong hash format ', async () => {
    // when
    const promise = appDataHexToCidLegacy('invalidHash')
    // then
    await assert.rejects(promise)
  })
})
