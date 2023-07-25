import type { ValidateFunction, default as AjvType } from 'ajv'

import { AnyAppDataDocVersion } from '../generatedTypes'
import { ValidationResult } from 'types'
import { importSchema } from '../importSchema'
import { AnyValidateFunction } from 'ajv/dist/core'

let _validatorPromise: Promise<AjvValidator> | undefined

interface AjvValidator {
  validator: AnyValidateFunction<unknown>
  ajv: AjvType
}

async function _createValidator(version: string): Promise<AjvValidator> {
  const ajv = await import('ajv').then(({ default: Ajv }) => new Ajv())

  let validator = ajv.getSchema(version)

  if (!validator) {
    const schema = await importSchema(version)
    ajv.addSchema(schema, version)
    validator = ajv.getSchema(version) as ValidateFunction
  }

  return { ajv, validator }
}

async function getValidator(version: string): Promise<AjvValidator> {
  if (!_validatorPromise) {
    _validatorPromise = _createValidator(version)
  }

  return _validatorPromise
}

export async function validateAppDataDoc(appDataDoc: AnyAppDataDocVersion): Promise<ValidationResult> {
  const { version } = appDataDoc

  try {
    const { ajv, validator } = await getValidator(version)
    const success = !!validator(appDataDoc)
    const errors = validator.errors ? ajv.errorsText(validator.errors) : undefined

    return { success, errors }
  } catch (e) {
    if (e instanceof Error) {
      return {
        success: false,
        errors: e.message,
      }
    } else {
      throw e
    }
  }
}
