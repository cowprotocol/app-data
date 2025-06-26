import Ajv from 'ajv'

import schemaV1_5_0 from '../schemas/v1.5.0.json'
import { buildAssertInvalidFn, buildAssertValidFn } from './test-utils'

describe('Schema v1.5.0: Add bridging metadata 1.0.0', () => {
  const ajv = new Ajv()
  const validator = ajv.compile(schemaV1_5_0)

  const BASE_DOCUMENT = {
    version: '1.5.0',
    metadata: {},
  }

  test('Minimal valid schema', buildAssertValidFn(validator, BASE_DOCUMENT))

  test(
    'Valid destination token address and chainId',
    buildAssertValidFn(validator, {
      ...BASE_DOCUMENT,
      metadata: {
        bridging: {
          destinationTokenAddress: '0x00E989b87700514118Fa55326CD1cCE82faebEF6',
          destinationChainId: 42161
        }
      },
    })
  )

  test(
    'Invalid destination token address (must match the ethereum address regex)',
    buildAssertInvalidFn(
      validator,
      {
        ...BASE_DOCUMENT,
        metadata: {bridging: {destinationTokenAddress: '0x1', destinationChainId: 42161}},
      },
      [
        {
          'instancePath': '/metadata/bridging/destinationTokenAddress',
          'keyword': 'pattern',
          'message': 'must match pattern "^0x[a-fA-F0-9]{40}$"',
          'params': {
            'pattern': '^0x[a-fA-F0-9]{40}$'
          },
          'schemaPath': '#/properties/metadata/properties/partnerFee/definitions/recipient/pattern'
        }
      ]
    )
  )

  test(
    'Invalid destination chainId (must be an integer)',
    buildAssertInvalidFn(
      validator,
      {
        ...BASE_DOCUMENT,
        metadata: {
          bridging: {
            destinationTokenAddress: '0x00E989b87700514118Fa55326CD1cCE82faebEF6',
            destinationChainId: 'a2'
          }
        },
      },
      [
        {
          'instancePath': '/metadata/bridging/destinationChainId',
          'keyword': 'type',
          'message': 'must be integer',
          'params': {
            'type': 'integer'
          },
          'schemaPath': '#/properties/metadata/properties/bridging/properties/destinationChainId/type'
        }
      ]
    )
  )
})

