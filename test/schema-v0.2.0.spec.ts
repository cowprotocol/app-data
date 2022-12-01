import Ajv  from 'ajv'

import schemaV0_2_0 from '../schemas/v0.2.0.json'

import { ADDRESS, MISSING_VERSION_ERROR, QUOTE, REFERRER } from './mock'
import { assertDoc, expectToRaise } from './utils'

const BASE_DOCUMENT = {
  version: '0.2.0',
  metadata: {},
}

const ajv = new Ajv()
const validator = ajv.compile(schemaV0_2_0)


test('Minimal valid schema', assertDoc(validator, BASE_DOCUMENT))

test('Missing required fields', expectToRaise(validator, {}, MISSING_VERSION_ERROR))

test(
  'With referrer v0.1.0 and quote v0.1.0 metadata',
  assertDoc(validator, {
    ...BASE_DOCUMENT,
    appCode: 'MyApp',
    metadata: {
      referrer: REFERRER.v1,
      quote: QUOTE.v1,
    },
  })
)

test(
  'With invalid quote metadata v0.1.0',
  expectToRaise(
    validator,
    {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      metadata: {
        referrer: REFERRER.v1,
        quote: { sellAmount: 'xx12d', buyAmount: 0.13, version: '0.1.0' },
      },
    },
    [
      {
        instancePath: '/metadata/quote/sellAmount',
        keyword: 'pattern',
        message: 'must match pattern "^\\d+$"',
        params: { pattern: '^\\d+$' },
        schemaPath: '#/properties/metadata/properties/quote/properties/buyAmount/pattern',
      },
    ]
  )
)
