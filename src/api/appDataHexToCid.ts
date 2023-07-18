import { MetaDataError } from '../consts'

export async function appDataHexToCid(appDataHex: string): Promise<string> {
  const cid = await _appDataHexToCid(appDataHex)
  _assertCid(cid, appDataHex)

  return cid
}

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
  const cidPrefix = new Uint8Array(4)
  cidPrefix[0] = 0x01 // CIDv1
  cidPrefix[1] = 0x55 // Raw codec
  cidPrefix[2] = 0x1b // keccak hash algorithm
  cidPrefix[3] = 32 // keccak hash length (0x20 = 32)

  const { arrayify } = await import('ethers/lib/utils')
  const hashBytes = arrayify(appDataHex) // 32 bytes of the keccak256 hash

  // Concat prefix and multihash
  var cidBytes = new Uint8Array(cidPrefix.length + hashBytes.length)
  cidBytes.set(cidPrefix)
  cidBytes.set(hashBytes, cidPrefix.length)

  // Encode to base16
  const { base16 } = await import('multiformats/bases/base16')
  return base16.encode(cidBytes)
}

async function _appDataHexToCidLegacy(appDataHex: string): Promise<string> {
  const cidPrefix = new Uint8Array(4)
  cidPrefix[0] = 0x01 // CIDv1
  cidPrefix[1] = 0x70 // dag-pb
  cidPrefix[2] = 0x12 // sha2-256 hash algorithm
  cidPrefix[3] = 32 //  SHA-256 length (0x20 = 32)

  const { arrayify } = await import('ethers/lib/utils')
  const hashBytes = arrayify(appDataHex) // 32 bytes of the keccak256 hash

  // Concat prefix and multihash
  var cidBytes = new Uint8Array(cidPrefix.length + hashBytes.length)
  cidBytes.set(cidPrefix)
  cidBytes.set(hashBytes, cidPrefix.length)

  const { CID } = await import('multiformats/cid')
  return CID.decode(cidBytes).toV0().toString()
}
