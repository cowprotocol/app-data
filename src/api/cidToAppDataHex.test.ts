import { describe, test } from 'node:test'
import assert from 'node:assert'
import { APP_DATA_HEX, APP_DATA_HEX_2, CID, CID_2 } from '../mocks'
import { cidToAppDataHex } from './cidToAppDataHex'

describe('cidToAppDataHex', () => {
  test('Happy path', async () => {
    // when
    const result = await cidToAppDataHex(CID)

    // then
    assert.strictEqual(result, APP_DATA_HEX)
  })

  test('Happy path 2', async () => {
    // when
    const result = await cidToAppDataHex(CID_2)

    // then
    assert.strictEqual(result, APP_DATA_HEX_2)
  })

  test('Malformed CID', async () => {
    // when & then
    await assert.rejects(cidToAppDataHex('invalidCid'))
  })
})
