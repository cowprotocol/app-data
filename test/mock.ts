export const MISSING_VERSION_ERROR = [
  {
    instancePath: '',
    keyword: 'required',
    message: "must have required property 'version'",
    params: { missingProperty: 'version' },
    schemaPath: '#/required',
  },
]

export const ADDRESS = '0xb6BAd41ae76A11D10f7b0E664C5007b908bC77C9'

// Referrer
export const REFERRER = {
  v1: { address: ADDRESS, version: '0.1.0' }
}

// Quote
export const QUOTE = {
  v1: { sellAmount: '123123', buyAmount: '1314123', version: '0.1.0' },
  v2: { slippageBips: '1', version: '0.2.0' }
}

// Quote
export const CLASS = {
  v1: { type: 'market', version: '0.1.0' }
}