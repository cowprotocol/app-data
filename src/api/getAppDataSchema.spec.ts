import { describe, test } from 'node:test'
import assert from 'node:assert'
import { getAppDataSchema } from './getAppDataSchema'

describe('getAppDataSchema', async () => {
  await test('Returns existing schema', async () => {
    // given
    const version = '0.4.0'
    // when
    const schema = await getAppDataSchema(version)
    // then
    // @ts-ignore
    assert.match(schema.$id, new RegExp(version))
  })

  await test('Throws on invalid schema', async () => {
    // given
    const version = '0.0.0'
    // when & then
    await assert.rejects(getAppDataSchema(version), { message: `AppData version ${version} doesn't exist` })

    await test('Non-existent version throws', async () => {
      // given
      const version = '0.0.0'
      // when & then
      await assert.rejects(getAppDataSchema(version), { message: `AppData version ${version} doesn't exist` })
    })

    await test('Non-semver version throws', async () => {
      // given
      const version = 'not semver'
      // when & then
      await assert.rejects(getAppDataSchema(version), { message: `AppData version ${version} is not a valid version` })
    })

    await test('Version 0.1.0', _buildAssertVersionFn('0.1.0'))
    await test('Version 0.2.0', _buildAssertVersionFn('0.2.0'))
    await test('Version 0.3.0', _buildAssertVersionFn('0.3.0'))
    await test('Version 0.4.0', _buildAssertVersionFn('0.4.0'))
  })
})

function _buildAssertVersionFn(version: string) {
  return async () => {
    // when
    const schema = await getAppDataSchema(version)
    // then
    // @ts-ignore
    assert.match(schema.$id, new RegExp(version))
  }
}
