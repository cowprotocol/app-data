import { validateAppDataDoc } from './validateAppDataDoc'

import { generateAppDataDoc } from './generateAppDataDoc'
import { uploadMetadataDocToIpfsLegacy } from './uploadMetadataDocToIpfsLegacy'
import { getAppDataSchema } from './getAppDataSchema'
import { fetchDocFromAppDataHex, fetchDocFromAppDataHexLegacy } from './fetchDocFromAppData'
import { appDataHexToCid, appDataHexToCidLegacy } from './appDataHexToCid'
import { appDataToCid, appDataToCidLegacy } from './appDataToCid'
import { fetchDocFromCid } from './fetchDocFromCid'
import { cidToAppDataHex } from './cidToAppDataHex'

export * from '../types'
export class MetadataApi {
  // Schema & Doc generation/validation
  getAppDataSchema = getAppDataSchema
  generateAppDataDoc = generateAppDataDoc
  validateAppDataDoc = validateAppDataDoc

  // appData / CID conversion
  appDataToCid = appDataToCid // (appData | fullAppData) --> cid
  appDataHexToCid = appDataHexToCid // appDataHex --> cid
  cidToAppDataHex = cidToAppDataHex // cid --> appDataHex

  // Fetch appData document from IPFS
  fetchDocFromCid = fetchDocFromCid // cid --> document
  fetchDocFromAppDataHex = fetchDocFromAppDataHex // appDataHex --> appData

  // ---- Deprecated methods ----
  // Upload to IPFS (deprecated)
  uploadMetadataDocToIpfsLegacy = uploadMetadataDocToIpfsLegacy //  appData --> cid + publish IPFS
  appDataToCidLegacy = appDataToCidLegacy // (appData | fullAppData) --> cid
  appDataHexToCidLegacy = appDataHexToCidLegacy // appDataHex --> cid
  fetchDocFromAppDataHexLegacy = fetchDocFromAppDataHexLegacy // appDataHex --> appData
}
