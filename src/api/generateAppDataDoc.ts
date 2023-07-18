import { AppDataParams } from '../types'
import { LatestAppDataDocVersion, LATEST_APP_DATA_VERSION } from '../generatedTypes'

const DEFAULT_APP_CODE = 'CoW Swap'
const DEFAULT_APP_DATA_DOC = {
  appCode: DEFAULT_APP_CODE,
  metadata: {},
  version: LATEST_APP_DATA_VERSION,
}

/**
 * Creates an appData document using the latest specification of the format
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
export async function generateAppDataDoc(params?: AppDataParams): Promise<LatestAppDataDocVersion> {
  return {
    ...DEFAULT_APP_DATA_DOC,
    ...params,
    version: LATEST_APP_DATA_VERSION,
  }
}
