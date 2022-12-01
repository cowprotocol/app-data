import Ajv  from 'ajv'

import schemaV0_3_0 from '../schemas/v0.3.0.json'

import { ADDRESS, MISSING_VERSION_ERROR } from './mock'
import { assertDoc, expectToRaise } from './utils'

const BASE_DOCUMENT = {
  version: '0.3.0',
  metadata: {},
}


const ajv = new Ajv()
const validator = ajv.compile(schemaV0_3_0)


test('Minimal valid schema', assertDoc(validator, BASE_DOCUMENT))

test('Missing required fields', expectToRaise(validator, {}, MISSING_VERSION_ERROR))

test(
  'With environment and full metadata (both v0.1.0)',
  assertDoc(validator, {
    ...BASE_DOCUMENT,
    appCode: 'MyApp',
    environment: 'prod',
    metadata: {
      referrer: {
        address: ADDRESS,
        version: '0.1.0'
      },
      quote: { 
        sellAmount: '123123',
        buyAmount: '1314123',
        version: '0.1.0'
      },
    },
  })
)
