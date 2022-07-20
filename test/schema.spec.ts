import Ajv from 'ajv'

import schemaV0_1_0 from '../schemas/v0.1.0.json'
import schemaV0_2_0 from '../schemas/v0.2.0.json'
import schemaV0_3_0 from '../schemas/v0.3.0.json'
import schemaV0_4_0 from '../schemas/v0.4.0.json'

const ADDRESS = '0xb6BAd41ae76A11D10f7b0E664C5007b908bC77C9'
const REFERRER_V0_1_0 = { address: ADDRESS, version: '0.1.0' }
const QUOTE_V0_1_0 = { sellAmount: '123123', buyAmount: '1314123', version: '0.1.0' }
const QUOTE_V0_2_0 = { slippageBips: '1', version: '0.2.0' }

const MISSING_VERSION_ERROR = [
  {
    instancePath: '',
    keyword: 'required',
    message: "must have required property 'version'",
    params: { missingProperty: 'version' },
    schemaPath: '#/required',
  },
]

describe('Schema v0.1.0', () => {
  const ajv = new Ajv()
  const validator = ajv.compile(schemaV0_1_0)

  const BASE_DOCUMENT = {
    version: '0.1.0',
    metadata: {},
  }

  test('Minimal valid schema', () => {
    // given
    // when
    const actual = validator(BASE_DOCUMENT)
    // then
    expect(actual).toBeTruthy()
  })

  test('Missing required fields', () => {
    // given
    const doc = {}
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual(MISSING_VERSION_ERROR)
  })

  test('With referrer metadata', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      metadata: {
        referrer: REFERRER_V0_1_0,
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeTruthy()
  })

  test('With invalid referrer metadata', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      metadata: {
        referrer: { address: '0xas', version: '0.1.0' },
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual([
      {
        instancePath: '/metadata/referrer/address',
        keyword: 'pattern',
        message: 'must match pattern "^0x[a-fA-F0-9]{40}$"',
        params: { pattern: '^0x[a-fA-F0-9]{40}$' },
        schemaPath: '#/properties/metadata/properties/referrer/properties/address/pattern',
      },
    ])
  })
})

describe('Schema v0.2.0', () => {
  const ajv = new Ajv()
  const validator = ajv.compile(schemaV0_2_0)

  const BASE_DOCUMENT = {
    version: '0.2.0',
    metadata: {},
  }

  test('Minimal valid schema', () => {
    // given
    // when
    const actual = validator(BASE_DOCUMENT)
    // then
    expect(actual).toBeTruthy()
  })

  test('Missing required fields', () => {
    // given
    const doc = {}
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual(MISSING_VERSION_ERROR)
  })

  test('With referrer v0.1.0 and quote v0.1.0 metadata', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      metadata: {
        referrer: REFERRER_V0_1_0,
        quote: QUOTE_V0_1_0,
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeTruthy()
  })

  test('With invalid quote metadata v0.1.0', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      metadata: {
        referrer: REFERRER_V0_1_0,
        quote: { sellAmount: 'xx12d', buyAmount: 0.13, version: '0.1.0' },
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual([
      {
        instancePath: '/metadata/quote/sellAmount',
        keyword: 'pattern',
        message: 'must match pattern "^\\d+$"',
        params: { pattern: '^\\d+$' },
        schemaPath: '#/properties/metadata/properties/quote/properties/buyAmount/pattern',
      },
    ])
  })
})

describe('Schema v0.3.0', () => {
  const ajv = new Ajv()
  const validator = ajv.compile(schemaV0_3_0)

  const BASE_DOCUMENT = {
    version: '0.3.0',
    metadata: {},
  }

  test('Minimal valid schema', () => {
    // given
    // when
    const actual = validator(BASE_DOCUMENT)
    // then
    expect(actual).toBeTruthy()
  })

  test('Missing required fields', () => {
    // given
    const doc = {}
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual(MISSING_VERSION_ERROR)
  })

  test('With environment and full metadata (both v0.1.0)', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      environment: 'prod',
      metadata: {
        referrer: REFERRER_V0_1_0,
        quote: QUOTE_V0_1_0,
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeTruthy()
  })
})

describe('Schema v0.4.0', () => {
  const ajv = new Ajv()
  const validator = ajv.compile(schemaV0_4_0)

  const BASE_DOCUMENT = {
    version: '0.4.0',
    metadata: {},
  }

  test('Minimal valid schema', () => {
    // given
    // when
    const actual = validator(BASE_DOCUMENT)
    // then
    expect(actual).toBeTruthy()
  })

  test('Missing required fields', () => {
    // given
    const doc = {}
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual(MISSING_VERSION_ERROR)
  })

  test('With quote metadata v0.2.0', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      environment: 'prod',
      metadata: {
        referrer: REFERRER_V0_1_0,
        quote: QUOTE_V0_2_0,
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeTruthy()
  })

  test('With invalid quote metadata v0.2.0', () => {
    // given
    const doc = {
      ...BASE_DOCUMENT,
      appCode: 'MyApp',
      environment: 'prod',
      metadata: {
        referrer: REFERRER_V0_1_0,
        quote: QUOTE_V0_1_0,
      },
    }
    // when
    const actual = validator(doc)
    // then
    expect(actual).toBeFalsy()
    expect(validator.errors).toEqual([
      {
        instancePath: '/metadata/quote',
        keyword: 'required',
        message: "must have required property 'slippageBips'",
        params: { missingProperty: 'slippageBips' },
        schemaPath: '#/properties/metadata/properties/quote/required',
      },
    ])
  })
})
