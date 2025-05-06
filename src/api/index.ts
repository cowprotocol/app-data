import { appDataHexToCid, appDataHexToCidLegacy } from './appDataHexToCid'
import { getAppDataInfo, getAppDataInfoLegacy } from './getAppDataInfo'
import { cidToAppDataHex } from './cidToAppDataHex'
import { fetchDocFromAppDataHex, fetchDocFromAppDataHexLegacy } from './fetchDocFromAppData'
import { fetchDocFromCid } from './fetchDocFromCid'

import { generateAppDataDoc } from './generateAppDataDoc'
import { getAppDataSchema } from './getAppDataSchema'
import { uploadMetadataDocToIpfsLegacy } from './uploadMetadataDocToIpfsLegacy'
import { validateAppDataDoc } from './validateAppDataDoc'

export class MetadataApi {
  // Schema & Doc generation/validation
  getAppDataSchema = getAppDataSchema
  generateAppDataDoc = generateAppDataDoc
  validateAppDataDoc = validateAppDataDoc

  // appData / CID conversion
  getAppDataInfo = getAppDataInfo // (appData | fullAppData) --> cid
  appDataHexToCid = appDataHexToCid // appDataHex --> cid
  cidToAppDataHex = cidToAppDataHex // cid --> appDataHex

  legacy = {
    // Fetch appData document from IPFS (deprecated)
    fetchDocFromCid: fetchDocFromCid, // cid --> document
    fetchDocFromAppDataHex: fetchDocFromAppDataHex, // appDataHex --> appData

    // Upload to IPFS (deprecated)
    uploadMetadataDocToIpfsLegacy: uploadMetadataDocToIpfsLegacy, //  appData --> cid + publish IPFS
    appDataToCidLegacy: getAppDataInfoLegacy, // (appData | fullAppData) --> cid
    appDataHexToCidLegacy: appDataHexToCidLegacy, // appDataHex --> cid
    fetchDocFromAppDataHexLegacy: fetchDocFromAppDataHexLegacy, // appDataHex --> appData
  }
}
