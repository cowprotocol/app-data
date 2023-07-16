import type { CID, MultibaseDecoder } from 'multiformats/cid'

export async function parseCid(ipfsHash: string): Promise<CID> {
  const { CID } = await import('multiformats/cid')

  const decoder = await getDecoder(ipfsHash)
  return CID.parse(ipfsHash, decoder)
}

export async function decodeCid(bytes: Uint8Array): Promise<CID> {
  const { CID } = await import('multiformats/cid')
  return CID.decode(bytes)
}

async function getDecoder<Prefix extends string>(ipfsHash: string): Promise<MultibaseDecoder<Prefix> | undefined> {
  if (ipfsHash[0] === 'f') {
    // Base 16 encoding
    const { base16 } = await import('multiformats/bases/base16')
    return base16
  }

  // Use default decoder
  return undefined
}

export async function extractDigest(cid: string): Promise<string> {
  const cidDetails = await parseCid(cid)
  const { digest } = cidDetails.multihash

  return `0x${Buffer.from(digest).toString('hex')}`
}
