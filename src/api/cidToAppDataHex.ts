import { extractDigest } from '../utils/ipfs'

/**
 * Convert a CID to an app-data hex string
 *
 */
export async function cidToAppDataHex(cid: string): Promise<string> {
  return extractDigest(cid)
}
