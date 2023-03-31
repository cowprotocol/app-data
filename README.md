# @cowprotocol/app-data

AppData schema definitions

These schemas are used in the data encoded on `appData` field for CowProtocol orders.

For more details, check [the docs](https://docs.cow.fi/cow-sdk/order-meta-data-appdata).

## Installation

```bash
yarn add @cowprotocol/app-data
```


## Usage

```typescript
import { MetadataApi } from '@cowprotocol/app-data'

export const metadataApi = new MetadataApi()

const IPFS_OPTIONS = {
  pinataApiKey: `PINATA_API_KEY`,
  pinataApiSecret: `PINATA_SECRET_API_KEY`,
}

const appCode = 'YOUR_APP_CODE'
const environment = 'prod'
const referrerParams = { address: `REFERRER_ADDRESS` }

const quoteParams = { slippageBips: '0.5' } // Slippage percent, it's 0 to 100
const orderClassParams = { orderClass: 'market' } // "market" | "limit" | "liquidity"

const appDataDoc = await metadataApi.generateAppDataDoc({
  appDataParams: { appCode, environment },
  metadataParams: { referrerParams, quoteParams, orderClassParams },
})

const appDataHash = await metadataApi.calculateAppDataHash(appDataDoc)
const actualHash = await metadataApi.uploadMetadataDocToIpfs(appDataDoc, IPFS_OPTIONS)

console.log(appDataHash === actualHash) // Should be true
```


### Schemas

Schemas are exposed as json files, where the version is the file name:

```js
// Getting the version v0.4.0
const schema = require('@cowprotocol/app-data/schemas/v0.4.0.json')

// Now you can for example run validation against a schema
```

### Type definitions

There are also type definitions

```js
import { v0_4_0 } from '@cowprotocol/app-data'

// Note: this example is
function createAppDataV0_4_0(
  appCode: v0_4_0.AppCode,
  metadata: v0_4_0.Metadata
): v0_4_0.AppDataRootSchema {
  return {
    version: '0.4.0',
    appCode,
    metadata
  }
}
```

### Constants

The latest version names are exposed as constants

```js
import {
  LATEST_APP_DATA_VERSION,
  LATEST_QUOTE_METADATA_VERSION,
  LATEST_REFERRER_METADATA_VERSION
} from '@cowprotocol/app-data'
```

### Utils

*Create appData doc*

There are util functions to handle the creation of valid schema docs for the latest version

```js
import {
  createAppDataDoc, createReferrerMetadata, createQuoteMetadata
} from '@cowprotocol/app-data'

const referrer = createReferrerMetadata({ address: '0x...' })
const quote = createQuoteMetadata({ slippageBips: '100' })
const appDataDoc = createAppDataDoc({ appCode: 'myApp', metadata: { referrer, quote } })
```

*Get appData schema*

To get a schema definition by version

```js
import { getAppDataSchema } from '@cowprotocol/app-data'

const schema = getAppDataSchema('0.1.0')
```

It'll throw if the version does not exist

*Validate appDataDoc*

To validate a document, pass it to `validateAppDataDoc`.
It'll return an object with a boolean indicating `success` and `errors`, if any.
The version to validate against will be taken from the doc itself.

```js
import { validateAppDataDoc } from '@cowprotocol/app-data'

let doc = { version: '0.4.0', metadata: {} }

let result = await validateAppDataDoc(doc)
console.log(result) // { success: true }

doc = { version: '0.0.0', metadata: {} }

result = await validateAppDataDoc(doc)
// Contrary to `getAppDataSchema`, invalid or non-existing schemas won't throw
console.log(result) // { success: false, errors: 'AppData version 0.0.0 doesn\'t exist'}
```

