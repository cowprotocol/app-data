# @cowprotocol/app-data

AppData schema definitions

These schemas are used in the data encoded on `appData` field for CowProtocol orders.

For more details, check [the docs](https://docs.cow.fi/cow-sdk/order-meta-data-appdata).

## Usage

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
import {v0_4_0} from '@cowprotocol/app-data'

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

There are util functions to handle the creation of valid schema docs for the latest version

```js
import {
  createAppDataDoc, createReferrerMetadata, createQuoteMetadata
} from '@cowprotocol/app-data'

const referrer = createReferrerMetadata({address: '0x...'})
const quote = createQuoteMetadata({slippageBips: '100'})
const appDataDoc = createAppDataDoc({appCode: 'myApp', metadata: {referrer, quote}})
```

## TODO:

- [ ] Add tests for:
    - [ ] Consuming only the schema
    - [ ] Importing the type definitions
