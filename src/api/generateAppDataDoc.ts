import { GenerateAppDataDocParams, MetadataParams } from 'types'
import {
  latest,
  LatestAppDataDocVersion,
  LATEST_APP_DATA_VERSION,
  LATEST_ORDER_CLASS_METADATA_VERSION,
  LATEST_QUOTE_METADATA_VERSION,
  LATEST_REFERRER_METADATA_VERSION,
  LATEST_UTM_METADATA_VERSION,
} from '../generatedTypes'

const DEFAULT_APP_CODE = 'CowSwap'

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
export async function generateAppDataDoc(params?: GenerateAppDataDocParams): Promise<LatestAppDataDocVersion> {
  const { appDataParams, metadataParams } = params || {}

  return {
    ...appDataParams,
    appCode: appDataParams?.appCode || DEFAULT_APP_CODE,
    metadata: _toMetadata(metadataParams),
    version: LATEST_APP_DATA_VERSION,
  }
}

function _toMetadata(metadataParams: MetadataParams | undefined): latest.Metadata {
  const { referrerParams, quoteParams, orderClassParams, utmParams } = metadataParams || {}

  const metadata: latest.Metadata = {}
  if (referrerParams) {
    metadata.referrer = {
      ...referrerParams,
      version: LATEST_REFERRER_METADATA_VERSION,
    }
  }

  if (quoteParams) {
    metadata.quote = {
      ...quoteParams,
      version: LATEST_QUOTE_METADATA_VERSION,
    }
  }

  if (orderClassParams) {
    metadata.orderClass = {
      ...orderClassParams,
      version: LATEST_ORDER_CLASS_METADATA_VERSION,
    }
  }

  if (utmParams) {
    metadata.utm = {
      ...utmParams,
      version: LATEST_UTM_METADATA_VERSION,
    }
  }

  return metadata
}
