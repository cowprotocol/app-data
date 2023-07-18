import type { ValidateFunction, default as AjvType } from 'ajv'

import { AnyAppDataDocVersion } from '../generatedTypes'
import { ValidationResult } from 'types'
import { importSchema } from '../importSchema'

let ajv: AjvType

let _ajv: AjvType
let ajv$: Promise<AjvType>

async function getAjv(): Promise<AjvType> {
    if (_ajv) return _ajv

    if (ajv$) return ajv$

    return ajv$ = import('ajv').then(({default: Ajv}) => {
        _ajv = new Ajv()

        return _ajv
    })
}

export async function validateAppDataDoc(appDataDoc: AnyAppDataDocVersion): Promise<ValidationResult> {
    const { version } = appDataDoc

    const ajv = await getAjv()

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
