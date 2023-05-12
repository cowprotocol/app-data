import { getSerializedCID, loadIpfsFromCid } from './utils/appData'
import { calculateIpfsCidV0, Ipfs, pinJSONToIPFS } from './utils/ipfs'
import { GenerateAppDataDocParams, IpfsHashInfo } from './types'
import { MetaDataError } from './consts'
import {
  createAppDataDoc,
  createOrderClassMetadata,
  createQuoteMetadata,
  createReferrerMetadata,
  createUtmMetadata,
  getAppDataSchema,
  validateAppDataDoc,
  ValidationResult,
} from '../utils'
import { AnyAppDataDocVersion, latest, LatestAppDataDocVersion } from '../generatedTypes'

const DEFAULT_APP_CODE = 'CowSwap'

export class MetadataApi {
  /**
   * Creates an appDataDoc with the latest version format
   *
   * Without params creates a default minimum appData doc
   * Optionally creates metadata docs
   *
   * Example of result:
   * {
   *   "appCode": "CoW Swap",
   *   "environment": "local",
   *   "metadata": {
   *     "quote": {
   *       "slippageBips": "50",
   *       "version": "0.2.0"
   *     },
   *     "orderClass": {
   *       "orderClass": "market",
   *       "version": "0.1.0"
   *     }
   *   },
   *   "version": "0.5.0"
   * }
   */
  async generateAppDataDoc(params?: GenerateAppDataDocParams): Promise<LatestAppDataDocVersion> {
    const { appDataParams, metadataParams } = params || {}
    const { referrerParams, quoteParams, orderClassParams, utmParams } = metadataParams || {}

    const metadata: latest.Metadata = {}
    if (referrerParams) {
      metadata.referrer = createReferrerMetadata(referrerParams)
    }
    if (quoteParams) {
      metadata.quote = createQuoteMetadata(quoteParams)
    }
    if (orderClassParams) {
      metadata.orderClass = createOrderClassMetadata(orderClassParams)
    }
    if (utmParams) {
      metadata.utm = createUtmMetadata(utmParams)
    }

    const appCode = appDataParams?.appCode || DEFAULT_APP_CODE
    return createAppDataDoc({ ...appDataParams, appCode, metadata })
  }

  /**
   * Wrapper around @cowprotocol/app-data getAppDataSchema
   *
   * Returns the appData schema for given version, if any
   * Throws CowError when version doesn't exist
   */
  async getAppDataSchema(version: string): Promise<AnyAppDataDocVersion> {
    try {
      return await getAppDataSchema(version)
    } catch (e) {
      // Wrapping @cowprotocol/app-data Error into CowError
      const error = e as Error
      throw new MetaDataError(error.message)
    }
  }

  /**
   * Wrapper around @cowprotocol/app-data validateAppDataDoc
   *
   * Validates given doc against the doc's own version
   */
  async validateAppDataDoc(appDataDoc: AnyAppDataDocVersion): Promise<ValidationResult> {
    return validateAppDataDoc(appDataDoc)
  }

  async decodeAppData(hash: string, ipfsUri?: string): Promise<void | AnyAppDataDocVersion> {
    try {
      const cidV0 = await getSerializedCID(hash)
      if (!cidV0) throw new MetaDataError('Error getting serialized CID')
      return loadIpfsFromCid(cidV0, ipfsUri)
    } catch (e) {
      const error = e as MetaDataError
      console.error('Error decoding AppData:', error)
      throw new MetaDataError('Error decoding AppData: ' + error.message)
    }
  }

  async cidToAppDataHex(ipfsHash: string): Promise<string | void> {
    const { CID } = await import('multiformats/cid')
    const { digest } = CID.parse(ipfsHash).multihash
    return `0x${Buffer.from(digest).toString('hex')}`
  }

  async appDataHexToCid(hash: string): Promise<string | void> {
    const cidV0 = await getSerializedCID(hash)
    if (!cidV0) throw new MetaDataError('Error getting serialized CID')
    return cidV0
  }

  /**
   * Calculates appDataHash WITHOUT publishing file to IPFS
   *
   * This method is intended to quickly generate the appDataHash independent
   * of IPFS upload/pinning
   * The hash is deterministic thus uploading it to IPFS will give you the same
   * result
   *
   * WARNING!
   * One important caveat is that - like `uploadMetadataDocToIpfs` method - the
   * calculation is done with a stringified file without a new line at the end.
   * That means that you will get different results if the file is uploaded
   * directly as a file. For example:
   *
   * Consider the content `hello world`.
   *
   * Using IPFS's cli tool to updload a file with the contents above
   * (`ipfs add file`), it'll have the line ending and result in this CIDv0:
   * QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o
   *
   * While using this method - and `uploadMetadataDocToIpfs` - will give you
   * this CIDv0:
   * Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD
   *
   * @param appData
   */
  async calculateAppDataHash(appData: AnyAppDataDocVersion): Promise<IpfsHashInfo | void> {
    const validation = await this.validateAppDataDoc(appData)

    if (!validation?.success) {
      throw new MetaDataError(`Invalid appData provided: ${validation?.errors}`)
    }

    try {
      const cidV0 = await calculateIpfsCidV0(appData)
      const appDataHash = await this.cidToAppDataHex(cidV0)

      if (!appDataHash) {
        throw new MetaDataError(`Could not extract appDataHash from calculated cidV0 ${cidV0}`)
      }

      return { cidV0, appDataHash }
    } catch (e) {
      const error = e as MetaDataError
      throw new MetaDataError(`Failed to calculate appDataHash: ${error.message}`)
    }
  }

  async uploadMetadataDocToIpfs(appDataDoc: AnyAppDataDocVersion, ipfsConfig: Ipfs): Promise<string | void> {
    const { IpfsHash } = await pinJSONToIPFS(appDataDoc, ipfsConfig)
    return this.cidToAppDataHex(IpfsHash)
  }
}
