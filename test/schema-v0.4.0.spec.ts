import Ajv  from 'ajv'

import schemaV0_4_0 from '../schemas/v0.4.0.json'

import { ADDRESS, MISSING_VERSION_ERROR } from './mock'
import { assertDoc, expectToRaise } from './utils'

const REFERRER_V0_1_0 = { address: ADDRESS, version: '0.1.0' }

const ajv = new Ajv()
const validator = ajv.compile(schemaV0_4_0)

const BASE_DOCUMENT = {
  version: '0.4.0',
  metadata: {},
}

test('Minimal valid schema', assertDoc(validator, BASE_DOCUMENT))

test('Missing required fields', expectToRaise(validator, {}, MISSING_VERSION_ERROR))

test(
  'With quote metadata v0.2.0',
  assertDoc(validator, {
    ...BASE_DOCUMENT,
    appCode: 'MyApp',
    environment: 'prod',
    metadata: {
      referrer: REFERRER_V0_1_0,
      quote: { slippageBips: '1', version: '0.2.0' },
    },
  })
)

test(
  'With invalid quote metadata v0.2.0',
  expectToRaise(
    validator,
    {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      environment: 'prod',
      metadata: {
        referrer: REFERRER_V0_1_0,
        quote: { sellAmount: '123123', buyAmount: '1314123', version: '0.1.0' },
      },
    },
    [
      {
        instancePath: '/metadata/quote',
        keyword: 'required',
        message: "must have required property 'slippageBips'",
        params: { missingProperty: 'slippageBips' },
        schemaPath: '#/properties/metadata/properties/quote/required',
      },
    ]
  )
)

