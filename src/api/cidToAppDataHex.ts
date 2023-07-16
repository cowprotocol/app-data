import { extractDigest } from '../utils/ipfs'

export async function cidToAppDataHex(cid: string): Promise<string> {
  return extractDigest(cid)
}
