import { appDataHexToCidLegacy } from './appDataHexToCid'
import { APP_DATA_HEX_LEGACY, CID_LEGACY } from '../mocks'

describe('appDataHexToCid', () => {
  test('Happy path', async () => {
    // when
    const decodedAppDataHex = await appDataHexToCidLegacy(APP_DATA_HEX_LEGACY)
    // then
    expect(decodedAppDataHex).toEqual(CID_LEGACY)
  })

  test('Throws with wrong hash format ', async () => {
    // when
    const promise = appDataHexToCidLegacy('invalidHash')
    // then
    await expect(promise).rejects.toThrow('Incorrect length')
  })
})
