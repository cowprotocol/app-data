import type { ValidateFunction, default as AjvType } from 'ajv'

import { AnyAppDataDocVersion } from '../generatedTypes'
import { ValidationResult } from 'types'
import { importSchema } from '../importSchema'

let ajv: AjvType

export async function validateAppDataDoc(appDataDoc: AnyAppDataDocVersion): Promise<ValidationResult> {
  const { version } = appDataDoc

  if (!ajv) {
    const { default: Ajv } = await import('ajv')
    ajv = new Ajv()
  }

  let validator = ajv.getSchema(version)

  if (!validator) {
    let schema
    try {
      schema = await importSchema(version)
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

    ajv.addSchema(schema, version)
    validator = ajv.getSchema(version) as ValidateFunction
  }

  const success = !!validator(appDataDoc)
  const errors = validator.errors ? ajv.errorsText(validator.errors) : undefined

  return { success, errors }
}
