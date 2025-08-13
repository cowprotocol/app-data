import { describe, test } from 'node:test'
import assert from 'node:assert'
import { APP_DATA_DOC } from '../mocks'
import { validateAppDataDoc } from './validateAppDataDoc'

describe('validateAppDataDocument', () => {
  const v010Doc = {
    ...APP_DATA_DOC,
    metatadata: {
      referrer: { address: '0xb6BAd41ae76A11D10f7b0E664C5007b908bC77C9', version: '0.1.0' },
    },
  }
  const v040Doc = {
    ...v010Doc,
    version: '0.4.0',
    metadata: { ...v010Doc.metadata, quote: { slippageBips: '1', version: '0.2.0' } },
  }

  test('Version matches schema', async () => {
    // when
    const v010Validation = await validateAppDataDoc(v010Doc)
    const v040Validation = await validateAppDataDoc(v040Doc)
    // then
    assert(v010Validation.success, 'v010 validation should be successful')
    assert(v040Validation.success, 'v040 validation should be successful')
  })

  test("Version doesn't match schema", async () => {
    // when
    const v030Validation = await validateAppDataDoc({ ...v040Doc, version: '0.3.0' })
    // then
    assert.strictEqual(v030Validation.success, false)
    assert.strictEqual(v030Validation.errors, "data/metadata/quote must have required property 'sellAmount'")
  })

  test("Version doesn't exist", async () => {
    // when
    const validation = await validateAppDataDoc({ ...v010Doc, version: '0.0.0' })
    // then
    assert.strictEqual(validation.success, false)
    assert.strictEqual(validation.errors, "AppData version 0.0.0 doesn't exist")
  })

  test('Valid doc', async () => {
    // given
    const doc = { version: '0.4.0', metadata: {} }
    // when
    const result = await validateAppDataDoc(doc)
    // then
    assert(result.success, 'Validation should be successful')
    assert.strictEqual(result.errors, undefined)
  })

  test('Invalid doc', async () => {
    // given
    const doc = { version: '0.4.0', metadata: { referrer: { version: '312313', address: '0xssss' } } }
    // when
    const result = await validateAppDataDoc(doc)
    // then
    assert.strictEqual(result.success, false)
    assert.strictEqual(result.errors, 'data/metadata/referrer/address must match pattern "^0x[a-fA-F0-9]{40}$"')
  })

  test('Non existent version', async () => {
    // given
    const doc = { version: '0.0.0', metadata: {} }
    // when
    const result = await validateAppDataDoc(doc)
    // then
    assert.strictEqual(result.success, false)
    assert.strictEqual(result.errors, `AppData version 0.0.0 doesn't exist`)
  })
})
