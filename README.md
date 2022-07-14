# @cowprotocol/app-data

AppData schema definitions

These schemas are used in the data encoded on `appData` field for CowProtocol orders.

For more details, check [the docs](https://docs.cow.fi/cow-sdk/order-meta-data-appdata).

## Usage

Schemas are exposed as json files, where the version is the file name:

```js
// Getting the version v0.4.0
const schema = require('@cowprotocol/app-data/schemas/v0.4.0.json')

// Now you can for example run validation against a schema
```

There are also type definitions

```js
import { v0_4_0 } from '@cowprotocol/app-data'

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

## TODO:

- [ ] Add tests for:
  - [ ] Consuming only the schema
  - [ ] Importing the type definitions
