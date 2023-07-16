export const HTTP_STATUS_OK = 200
export const HTTP_STATUS_INTERNAL_ERROR = 500

export const APP_DATA_DOC = {
  version: '0.7.0',
  appCode: 'CowSwap',
  metadata: {},
}

export const APP_DATA_STRING = '{"appCode":"CowSwap","metadata":{},"version":"0.7.0"}'
export const CID = 'f01551b209fceb93639711ec5c54912346bb530984d71d3641fa2ebaa0d2eb75790a58cf1' // https://cid.ipfs.tech/#f01551b209fceb93639711ec5c54912346bb530984d71d3641fa2ebaa0d2eb75790a58cf1
export const APP_DATA_HEX = '0x9fceb93639711ec5c54912346bb530984d71d3641fa2ebaa0d2eb75790a58cf1'

export const APP_DATA_DOC_CUSTOM = {
  ...APP_DATA_DOC,
  environment: 'test',
  metadata: {
    referrer: {
      address: '0x1f5B740436Fc5935622e92aa3b46818906F416E9',
      version: '0.1.0',
    },
    quote: {
      slippageBips: '1',
      version: '0.2.0',
    },
  },
}

// Another example of AppData (same as the backend uses in the tests
// See https://github.com/cowprotocol/services/blob/main/crates/app-data-hash/src/lib.rs#L64
export const APP_DATA_STRING_2 =
  '{"appCode":"CoW Swap","environment":"production","metadata":{"quote":{"slippageBips":"50","version":"0.2.0"},"orderClass":{"orderClass":"market","version":"0.1.0"}},"version":"0.6.0"}'
export const CID_2 = 'f01551b208af4e8c9973577b08ac21d17d331aade86c11ebcc5124744d621ca8365ec9424' // https://cid.ipfs.tech/#f01551b208af4e8c9973577b08ac21d17d331aade86c11ebcc5124744d621ca8365ec9424
export const APP_DATA_HEX_2 = '0x8af4e8c9973577b08ac21d17d331aade86c11ebcc5124744d621ca8365ec9424'

// Legacy IPFS Hash format and AppData
export const APP_DATA_STRING_LEGACY = '{"version":"0.7.0","appCode":"CowSwap","metadata":{}}' // Slightly different than FULL_APP_DATA because legacy used undeterministic JSON.stringify while now we use stringifyDeterministic method
export const CID_LEGACY = 'QmUbsYUqP4DXDvXDipKDG6hKhKnb6dADMeBiHHYJiizr25' // https://cid.ipfs.tech/#QmUbsYUqP4DXDvXDipKDG6hKhKnb6dADMeBiHHYJiizr25
export const APP_DATA_HEX_LEGACY = '0x5d0c585e073ac95728f9cdb05f640be38416ba93c493e842e52e1cf4514488fa'

export const PINATA_API_KEY = 'apikey'
export const PINATA_API_SECRET = 'apiSecret'
