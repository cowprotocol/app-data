import { MetaDataError, DEFAULT_IPFS_WRITE_URI } from '../consts'
import type { AnyAppDataDocVersion } from '../../generatedTypes'

type PinataPinResponse = {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export interface Ipfs {
  uri?: string
  writeUri?: string
  readUri?: string
  pinataApiKey?: string
  pinataApiSecret?: string
}

export async function pinJSONToIPFS(
  file: unknown,
  { writeUri = DEFAULT_IPFS_WRITE_URI, pinataApiKey = '', pinataApiSecret = '' }: Ipfs
): Promise<PinataPinResponse> {
  const { default: fetch } = await import('cross-fetch')

  if (!pinataApiKey || !pinataApiSecret) {
    throw new MetaDataError('You need to pass IPFS api credentials.')
  }

  const body = JSON.stringify({
    pinataContent: file,
    pinataMetadata: { name: 'appData' },
  })

  const pinataUrl = `${writeUri}/pinning/pinJSONToIPFS`

  const response = await fetch(pinataUrl, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
    },
  })

  const data = await response.json()

  if (response.status !== 200) {
    throw new Error(data.error.details || data.error)
  }

  return data
}

/**
 * @deprecated Old way of deriving the IPFS CID from the appData up until 2023-05-25 (see https://github.com/cowprotocol/services/issues/1465)
 */
export async function calculateIpfsCidV0Legacy(doc: AnyAppDataDocVersion): Promise<string> {
  const docString = JSON.stringify(doc)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { of } = await import('ipfs-only-hash')
  return of(docString, { cidVersion: 0 })
}
