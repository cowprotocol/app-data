import { describe, test } from 'node:test'
import assert from 'node:assert'
import { APP_DATA_DOC_CUSTOM } from '../mocks'
import { generateAppDataDoc } from './generateAppDataDoc'

describe('generateAppDataDoc', () => {
  test('Creates appDataDoc with empty metadata ', async () => {
    // when
    const { metadata, version, appCode, environment } = await generateAppDataDoc({})

    // then
    assert(version)
    assert.deepStrictEqual(metadata, {})
    assert.strictEqual(appCode, APP_DATA_DOC_CUSTOM.appCode)
    assert.strictEqual(environment, undefined)
  })

  test('Creates appDataDoc with custom metadata ', async () => {
    // given
    const params = {
      environment: APP_DATA_DOC_CUSTOM.environment,
      metadata: APP_DATA_DOC_CUSTOM.metadata,
    }
    // when
    const { metadata, version, appCode, environment } = await generateAppDataDoc(params)

    // then
    assert(version)
    assert.deepStrictEqual(metadata, APP_DATA_DOC_CUSTOM.metadata)
    assert.strictEqual(appCode, APP_DATA_DOC_CUSTOM.appCode)
    assert.strictEqual(environment, APP_DATA_DOC_CUSTOM.environment)
  })
})
