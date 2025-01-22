import { isHex } from 'viem'
import { toBytes } from 'viem'
import { MetaDataError } from '../consts'

/**
 * @deprecated AppData is not longer stored on IPFS nor it's derived from IPFS content hashes
 *
 * @param appDataHex
 * @returns
 */
export async function appDataHexToCid(appDataHex: string): Promise<string> {
  const cid = await _appDataHexToCid(appDataHex)
  _assertCid(cid, appDataHex)

  return cid
}

/**
 * @deprecated AppData is not longer stored on IPFS nor it's derived from IPFS content hashes
 *
 * @param appDataHex
 * @returns
 */
export async function appDataHexToCidLegacy(appDataHex: string): Promise<string> {
  const cid = await _appDataHexToCidLegacy(appDataHex)
  _assertCid(cid, appDataHex)

  return cid
}

export async function _assertCid(cid: string, appDataHex: string) {
  if (!cid) throw new MetaDataError('Error getting CID from appDataHex: ' + appDataHex)
}

/**
 *  Derive the IPFS CID v1 from the appData hex
 *
 * For reference see  https://github.com/cowprotocol/services/issues/1465 and https://github.com/cowprotocol/services/blob/main/crates/app-data-hash/src/lib.rs
 *
 * @param appDataHex hex with tha appData hash
 * @returns the IPFS CID v0 of the content
 */
async function _appDataHexToCid(appDataHex: string): Promise<string> {
  const cidBytes = await _toCidBytes({
    version: 0x01, // CIDv1
    multicodec: 0x55, // Raw codec
    hashingAlgorithm: 0x1b, // keccak hash algorithm
    hashingLength: 32, // keccak hash length (0x20 = 32)
    multihashHex: appDataHex, // 32 bytes of the keccak256 hash
  })

  // Encode to base16
  const { base16 } = await import('multiformats/bases/base16')
  return base16.encode(cidBytes)
}

async function _appDataHexToCidLegacy(appDataHex: string): Promise<string> {
  const cidBytes = await _toCidBytes({
    version: 0x01, // CIDv1
    multicodec: 0x70, // dag-pb
    hashingAlgorithm: 0x12, // sha2-256 hash algorithm
    hashingLength: 32, //  SHA-256 length (0x20 = 32)
    multihashHex: appDataHex, // 32 bytes of the sha2-256 hash
  })

  const { CID } = await import('multiformats/cid')
  return CID.decode(cidBytes).toV0().toString()
}

interface ToCidParmams {
  version: number
  multicodec: number
  hashingAlgorithm: number
  hashingLength: number
  multihashHex: string
}

async function _toCidBytes({
  version,
  multicodec,
  hashingAlgorithm,
  hashingLength,
  multihashHex,
}: ToCidParmams): Promise<Uint8Array> {
  if (!isHex(multihashHex)) {
    throw new MetaDataError('Invalid hash format')
  }
  const hashBytes = toBytes(multihashHex)

  // Concat prefix and multihash
  const cidPrefix = Uint8Array.from([version, multicodec, hashingAlgorithm, hashingLength])
  var cidBytes = new Uint8Array(cidPrefix.length + hashBytes.length)
  cidBytes.set(cidPrefix)
  cidBytes.set(hashBytes, cidPrefix.length)

  return cidBytes
}
