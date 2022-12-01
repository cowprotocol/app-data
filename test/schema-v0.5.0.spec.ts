import Ajv  from 'ajv'

import schemaV0_5_0 from '../schemas/v0.5.0.json'

import { CLASS, MISSING_VERSION_ERROR, QUOTE, REFERRER } from './mock'
import { assertDoc, expectToRaise } from './utils'


const ajv = new Ajv()
const validator = ajv.compile(schemaV0_5_0)

const BASE_DOCUMENT = {
  version: '0.5.0',
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
      referrer: REFERRER.v1,
      quote: QUOTE.v2,
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
        referrer: REFERRER.v1,
        quote: QUOTE.v1,
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

describe('Order class', () => {
  // Valid order classes
  const VALID_CLASSES = ['market', 'limit', 'liquidity']

  VALID_CLASSES.forEach((orderClass) => {
    test(
      'Class: ' + orderClass,
      assertDoc(validator, {
        ...BASE_DOCUMENT,
        appCode: 'MyApp',
        environment: 'prod',
        metadata: {
          class: {
            ...CLASS.v1,
            class: orderClass
          },
        },
      })
    )
  });

  // Invalid order classes
  ['Market', 'LIMIT', 'cow', ''].forEach((orderClass) => {
    test(
      'Order Class: ' + orderClass,
      expectToRaise(validator, {
        ...BASE_DOCUMENT,
        appCode: 'MyApp',
        environment: 'prod',
        metadata: {
          class: {
            ...CLASS.v1,
            class: orderClass
          },
        },
      }, [
        {
          instancePath: '/metadata/class/class',
          keyword: 'enum',
          message: "must be equal to one of the allowed values",
          params: { allowedValues: VALID_CLASSES },
          schemaPath: "#/properties/metadata/properties/class/properties/class/enum",
        },
      ])
    )
  })
})
