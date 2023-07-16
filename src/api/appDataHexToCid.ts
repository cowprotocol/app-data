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

  const { getBytes } = await import('ethers')
  const hashBytes = getBytes(appDataHex) // 32 bytes of the keccak256 hash

  // Concat prefix and multihash
  var cidBytes = new Uint8Array(cidPrefix.length + hashBytes.length)
  cidBytes.set(cidPrefix)
  cidBytes.set(hashBytes, cidPrefix.length)

  // Encode to base16
  const { base16 } = await import('multiformats/bases/base16')
  return base16.encode(cidBytes)
}

async function _appDataHexToCidLegacy(appDataHex: string): Promise<string> {
  const cidVersion = 0x1 // cidv1
  const codec = 0x70 // dag-pb
  const type = 0x12 // sha2-256 hash algorithm
  const length = 32 // SHA-256 length (0x20 = 32)
  const _hash = appDataHex.replace(/(^0x)/, '')

  const hexHash = fromHexString(_hash)

  if (!hexHash) throw new Error('Invalid hex hash ' + _hash)

  const uint8array = Uint8Array.from([cidVersion, codec, type, length, ...hexHash])
  const { CID } = await import('multiformats/cid')
  return CID.decode(uint8array).toV0().toString()
}

function fromHexString(hexString: string) {
  const stringMatch = hexString.match(/.{1,2}/g)
  if (!stringMatch) return
  return new Uint8Array(stringMatch.map((byte) => parseInt(byte, 16)))
}
