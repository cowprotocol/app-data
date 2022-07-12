import {compileFromFile} from 'json-schema-to-typescript'
import $RefParser from "json-schema-ref-parser"
import * as fs from 'fs'
import * as path from 'path'

const SCHEMAS_SRC_PATH = path.join('src', 'schemas')
const SCHEMAS_DEST_PATH = 'schemas'
const TYPES_DEST_PATH = path.join('src', 'generatedTypes')

async function compileSchemas(): Promise<void> {
  // Creates destinations dirs
  console.info(`Creating '${TYPES_DEST_PATH}' and '${SCHEMAS_DEST_PATH}' dirs`)
  await fs.promises.mkdir(TYPES_DEST_PATH, {recursive: true})
  await fs.promises.mkdir(SCHEMAS_DEST_PATH)

  // Generates out file for types/index.ts
  const typesIndexPath = path.join(TYPES_DEST_PATH, 'index.ts')
  console.info(`Creating ${typesIndexPath} file`)
  const typesIndexFile = await fs.promises.open(typesIndexPath, 'w')
  await typesIndexFile.write(`// generated file, do not edit manually\n\n`)

  // Lists all schemas
  const schemas = await fs.promises.readdir(SCHEMAS_SRC_PATH, {withFileTypes: true})

  for (const schemaFileName of schemas) {
    // Ignores folders and non version schemas
    if (!schemaFileName.isFile() || !/^v\d+\.\d+\.\d+\.json$/.test(schemaFileName.name)) continue

    // Extracts version from file name
    const [version,] = schemaFileName.name.split("\.json")

    // Get schema path relative to repo root
    const schemaPath = path.join(SCHEMAS_SRC_PATH, schemaFileName.name)

    // Compiles schema files de-referencing `$ref`s
    console.info(`Compiling bundled schema file for ${schemaPath}`)
    const newSchemaFile = await $RefParser.bundle(schemaPath)
    await fs.promises.writeFile(path.join(SCHEMAS_DEST_PATH, `${version}.json`), JSON.stringify(newSchemaFile))

    // Compiles schema onto ts type declarations
    console.info(`Compiling ts typings for ${schemaPath}`)
    const tsFile = await compileFromFile(schemaPath, {cwd: SCHEMAS_SRC_PATH})
    await fs.promises.writeFile(path.join(TYPES_DEST_PATH, `${version}.ts`), tsFile)

    // Add export on types/index.ts for this version
    console.info(`Adding ts export for ${version}`)
    const exportName = version.replace(/\./g, '_')
    const versionImportPath = `./${version}`
    await typesIndexFile.write(`export * as ${exportName} from '${versionImportPath}'\n`)

  }

  await typesIndexFile.close()
}

compileSchemas()
