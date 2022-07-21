import { getAppDataSchema, validateAppDataDoc } from '../src'

describe(`getAppDataSchema`, () => {
  test('Non-existent version throws', async () => {
    // given
    const version = '0.0.0'
    // when
    const schemaPromise = getAppDataSchema(version)
    // then
    await expect(schemaPromise).rejects.toThrow(`AppData version ${version} doesn't exist`)
  })

  test('Non-semver version throws', async () => {
    // given
    const version = 'not semver'
    // when
    const schemaPromise = getAppDataSchema(version)
    // then
    await expect(schemaPromise).rejects.toThrow(`AppData version ${version} is not a valid version`)
  })

  test('Version 0.1.0', _buildAssertVersionFn('0.1.0'))
  test('Version 0.2.0', _buildAssertVersionFn('0.2.0'))
  test('Version 0.3.0', _buildAssertVersionFn('0.3.0'))
  test('Version 0.4.0', _buildAssertVersionFn('0.4.0'))
})

function _buildAssertVersionFn(version: string) {
  return async () => {
    // when
    const schema = await getAppDataSchema(version)
    // then
    expect(schema.$id).toMatch(version)
  }
}

describe('validateAppDataDoc', () => {
  // This test is meant to test only the validation fn
  // Schema tests are done on ../schema.spec.ts

  test('Valid doc', async () => {
    // given
    const doc = { version: '0.4.0', metadata: {} }
    // when
    const result = await validateAppDataDoc(doc)
    // then
    expect(result.success).toBeTruthy()
    expect(result.errors).toBeUndefined()
  })

  test('Invalid doc', async () => {
    // given
    const doc = { version: '0.4.0', metadata: { referrer: { version: '312313', address: '0xssss' } } }
    // when
    const result = await validateAppDataDoc(doc)
    // then
    expect(result.success).toBeFalsy()
    expect(result.errors).toEqual('data/metadata/referrer/address must match pattern "^0x[a-fA-F0-9]{40}$"')
  })

  test('Non existent version', async () => {
    // given
    const doc = { version: '0.0.0', metadata: {} }
    // when
    const result = await validateAppDataDoc(doc)
    // then
    expect(result.success).toBeFalsy()
    expect(result.errors).toEqual(`AppData version 0.0.0 doesn't exist`)
  })
})
