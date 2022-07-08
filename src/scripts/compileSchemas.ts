import {compileFromFile} from 'json-schema-to-typescript'
import * as fs from 'fs'
import * as path from 'path'

const SCHEMAS_PATH = path.join('src', 'schema')
const BASE_OUT_PATH = 'dist'
const TYPES_BASE_PATH = 'generatedTypes'
const TYPES_OUT_PATH = path.join('src', TYPES_BASE_PATH)

async function compileSchemas(): Promise<void> {
  // Copies `schema` to `dist`
  await fs.promises.cp(SCHEMAS_PATH, BASE_OUT_PATH, {recursive: true})

  // Creates types out dir
  await fs.promises.mkdir(TYPES_OUT_PATH, {recursive: true})

  // Generates out file for types/index.ts
  const typesIndexPath = path.join(TYPES_OUT_PATH, 'index.ts')
  const typesIndexFile = await fs.promises.open(typesIndexPath, 'w')
  await typesIndexFile.write(`// generated file, do not edit manually\n\n`)

  // Lists all schemas
  const schemas = await fs.promises.readdir(SCHEMAS_PATH, {withFileTypes: true})

  for (const schemaFileName of schemas) {
    // Ignores folders
    if (!schemaFileName.isFile() || !/\.json$/.test(schemaFileName.name)) continue

    // Extracts version from file name
    const [version,] = schemaFileName.name.split("\.json")

    // Prepare base and output relative paths
    const schemaPath = path.join(SCHEMAS_PATH, schemaFileName.name)
    // const typesDestinationPath = path.join(TYPES_OUT_PATH, version)

    // Creates type version dir
    // await fs.promises.mkdir(typesDestinationPath, {recursive: true})

    // Compiles schema onto ts type declarations
    const tsFile = await compileFromFile(schemaPath, {cwd: SCHEMAS_PATH})
    // await fs.promises.writeFile(path.join(typesDestinationPath, 'index.d.ts'), tsFile)
    fs.promises.writeFile(path.join(TYPES_OUT_PATH, `${version}.ts`), tsFile)

    // Add export on types/index.ts for this version
    const exportName = version.replace(/\./g, '_')
    const versionImportPath = `./${version}`
    // await typesIndexFile.write(`export * as ${exportName} from '${versionImportPath}'\n`)
    await typesIndexFile.write(`export * as ${exportName} from '${versionImportPath}'\n`)

  }

  await typesIndexFile.close()
}

compileSchemas()
