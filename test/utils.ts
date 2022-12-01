import { ValidateFunction } from 'ajv'

export function assertDoc(validator: ValidateFunction, doc: any) {
  return () => {
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeTruthy()
  }
}

export function expectToRaise(validator: ValidateFunction, doc: any, errors: any) {
  return () => {
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual(errors)
  }
}
