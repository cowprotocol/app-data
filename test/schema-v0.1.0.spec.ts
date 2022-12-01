import Ajv  from 'ajv'

import schemaV0_1_0 from '../schemas/v0.1.0.json'

import { ADDRESS, MISSING_VERSION_ERROR } from './mock'
import { assertDoc, expectToRaise } from './utils'

const BASE_DOCUMENT = {
  version: '0.1.0',
  metadata: {},
}

const ajv = new Ajv()
const validator = ajv.compile(schemaV0_1_0)

test('Minimal valid schema', assertDoc(validator, BASE_DOCUMENT))

test('Missing required fields', expectToRaise(validator, {}, MISSING_VERSION_ERROR))

test(
  'With referrer metadata',
  assertDoc(validator, {
    ...BASE_DOCUMENT,
    appCode: 'MyApp',
    metadata: {
      referrer: {
        address: ADDRESS,
        version: '0.1.0'
      },
    },
  })
)

test(
  'With invalid referrer metadata',
  expectToRaise(
    validator,
    {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      metadata: {
        referrer: { address: '0xas', version: '0.1.0' },
      },
    },
    [
      {
        instancePath: '/metadata/referrer/address',
        keyword: 'pattern',
        message: 'must match pattern "^0x[a-fA-F0-9]{40}$"',
        params: { pattern: '^0x[a-fA-F0-9]{40}$' },
        schemaPath: '#/properties/metadata/properties/referrer/properties/address/pattern',
      },
    ]
  )
)