import {
  AnyAppDataDocVersion,
  latest,
  LATEST_APP_DATA_VERSION,
  LATEST_QUOTE_METADATA_VERSION,
  LATEST_REFERRER_METADATA_VERSION,
} from './generatedTypes'

// TODO: Cannot understand why this doesn't work. TS complains saying the type parameters are unknown
// export function createQuoteMetadata(params: Omit<latest.Quote, 'version'>): latest.Quote {
export function createQuoteMetadata(params: { slippageBips: latest.SlippageBips }): latest.Quote {
  return {
    ...params,
    version: LATEST_QUOTE_METADATA_VERSION,
  }
}

// TODO: And this approach doesnt work for the same reason :shrug:
// export function createReferrerMetadata({address}: Omit<latest.Referrer, 'version'>): latest.Referrer {
export function createReferrerMetadata(params: { address: latest.ReferrerAddress }): latest.Referrer {
  return {
    ...params,
    version: LATEST_REFERRER_METADATA_VERSION,
  }
}

// TODO: same as previous 2...
// export function createAppDataDoc(params: Omit<AppDataDoc, 'version'>): latest.AppDataRootSchema {
export function createAppDataDoc(params: {
  appCode?: latest.AppCode
  environment?: latest.Environment
  metadata: latest.Metadata
}): latest.AppDataRootSchema {
  return {
    ...params,
    version: LATEST_APP_DATA_VERSION,
  }
}

export async function getAppDataSchema(version: string): Promise<AnyAppDataDocVersion> {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`AppData version ${version} is not a valid version`)
  }
  try {
    const f = await import(`../schemas/v${version}.json`)

    return f
  } catch (e) {
    throw new Error(`AppData version ${version} doesn't exist`)
  }
}
