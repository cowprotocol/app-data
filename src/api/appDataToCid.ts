import { IpfsHashInfo } from '../types'
import { MetaDataError } from '../consts'
import { AnyAppDataDocVersion } from '../generatedTypes'
import { validateAppDataDoc } from './validateAppDataDoc'
import { extractDigest } from '../utils/ipfs'
import { appDataHexToCid } from './appDataHexToCid'
import { stringifyDeterministic } from '../utils/stringify'

/**
 * Calculates appDataHex without publishing file to IPFS
 *
 * This method is intended to quickly generate the appDataHex independent
 * of IPFS upload/pinning
 *
 * @param appData JSON document which will be stringified in a deterministic way to calculate the IPFS hash
 */
export async function appDataToCid(appData: AnyAppDataDocVersion): Promise<IpfsHashInfo>

/**
 * Calculates appDataHex without publishing file to IPFS
 *
 * This method is intended to quickly generate the appDataHex independent
 * of IPFS upload/pinning
 *
 * @param fullAppData JSON string with the full appData document
 */
export async function appDataToCid(fullAppData: string): Promise<IpfsHashInfo | void>

export async function appDataToCid(appDataAux: AnyAppDataDocVersion | string): Promise<IpfsHashInfo> {
  return _appDataToCidAux(appDataAux, _appDataToCid)
}

/**
 * Calculates appDataHex without publishing file to IPFS
 *
 * This method is intended to quickly generate the appDataHex independent
 * of IPFS upload/pinning
 *
 * @deprecated Old way of deriving th hash
 *
 * @param appData JSON document which will be stringified in a deterministic way to calculate the IPFS hash
 */
export async function appDataToCidLegacy(appData: AnyAppDataDocVersion): Promise<IpfsHashInfo | void>

/**
 * Calculates appDataHex without publishing file to IPFS
 *
 * This method is intended to quickly generate the appDataHex independent
 * of IPFS upload/pinning
 *
 * @deprecated Old way of deriving th hash
 *
 * @param fullAppData JSON string with the full appData document
 */
export async function appDataToCidLegacy(fullAppData: string): Promise<IpfsHashInfo | void>

export async function appDataToCidLegacy(appDataAux: AnyAppDataDocVersion | string): Promise<IpfsHashInfo | void> {
  // For the legacy-mode we use plain JSON.stringify to mantain backwards compatibility, however this is not a good idea to do since JSON.stringify. Better specify the doc as a fullAppData string or use stringifyDeterministic
  const fullAppData = JSON.stringify(appDataAux)
  return _appDataToCidAux(fullAppData, _appDataToCidLegacy)
}

export async function _appDataToCidAux(
  appDataAux: AnyAppDataDocVersion | string,
  deriveCid: (fullAppData: string) => Promise<string>
): Promise<IpfsHashInfo> {
  const [appDataDoc, fullAppData] =
    typeof appDataAux === 'string'
      ? [JSON.parse(appDataAux), appDataAux]
      : [appDataAux, await stringifyDeterministic(appDataAux)]

  const validation = await validateAppDataDoc(appDataDoc)

  if (!validation?.success) {
    throw new MetaDataError(`Invalid appData provided: ${validation?.errors}`)
  }

  try {
    const cid = await deriveCid(fullAppData)
    const appDataHex = await extractDigest(cid)

    if (!appDataHex) {
      throw new MetaDataError(`Could not extract appDataHex from calculated cid ${cid}`)
    }

    return { cid, appDataHex }
  } catch (e) {
    const error = e as MetaDataError
    console.error('Failed to calculate appDataHex', error)
    throw new MetaDataError(`Failed to calculate appDataHex: ${error.message}`)
  }
}

/**
 *  Derive the IPFS CID v0 from the full appData JSON content
 *
 * @param fullAppData string with the full AppData in JSON format. It is a string to make the hashing deterministic (do not rely on stringification of objects)
 * @returns the IPFS CID v0 of the content
 */
async function _appDataToCid(fullAppDataJson: string): Promise<string> {
  const { utils } = await import('ethers')

  const appDataHex = await utils.keccak256(utils.toUtf8Bytes(fullAppDataJson))
  return appDataHexToCid(appDataHex)
}

export async function _appDataToCidLegacy(doc: AnyAppDataDocVersion | string): Promise<string> {
  const fullAppData = typeof doc === 'string' ? doc : stringifyDeterministic(doc)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { of } = await import('ipfs-only-hash')
  return of(fullAppData, { cidVersion: 0 })
}
