import { MetaDataError } from '../consts'
import { AnyAppDataDocVersion } from 'generatedTypes'

/**
 * Wrapper around @cowprotocol/app-data getAppDataSchema
 *
 * Returns the appData schema for given version, if any
 * Throws CowError when version doesn't exist
 */
export async function getAppDataSchema(version: string): Promise<AnyAppDataDocVersion> {
  try {
    return await importSchema(version)
  } catch (e) {
    // Wrapping @cowprotocol/app-data Error into CowError
    const error = e as Error
    throw new MetaDataError(error.message)
  }
}

export async function importSchema(version: string): Promise<AnyAppDataDocVersion> {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`AppData version ${version} is not a valid version`)
  }
  try {
    return await import(`../../schemas/v${version}.json`)
  } catch (e) {
    throw new Error(`AppData version ${version} doesn't exist`)
  }
}
