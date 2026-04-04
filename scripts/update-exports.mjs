import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packageJsonPath = path.join(rootDir, 'package.json')

function readPackageJson() {
  return JSON.parse(readFileSync(packageJsonPath, 'utf8'))
}

function getEntryExtension(directoryPath) {
  for (const fileName of ['index.ts', 'index.tsx']) {
    const absolutePath = path.join(directoryPath, fileName)
    try {
      const stats = statSync(absolutePath)
      if (stats.isFile()) {
        return fileName
      }
    } catch {
      // Ignore missing files and keep probing supported entry names.
    }
  }

  return null
}

function getFileEntry(itemName) {
  if (itemName === 'index.ts' || itemName === 'index.tsx') {
    return null
  }

  const extension = path.extname(itemName)
  if (extension !== '.ts' && extension !== '.tsx') {
    return null
  }

  return itemName.slice(0, -extension.length)
}

function getEntries(sourceDir, exportPrefix = '') {
  const absoluteDir = path.join(rootDir, sourceDir)
  const entries = []

  for (const item of readdirSync(absoluteDir, { withFileTypes: true })) {
    if (item.isDirectory()) {
      const entryFile = getEntryExtension(path.join(absoluteDir, item.name))
      if (!entryFile) {
        continue
      }

      const exportName = exportPrefix ? `${exportPrefix}/${item.name}` : item.name
      entries.push([`./${exportName}`, `./${sourceDir}/${item.name}/${entryFile}`])
      continue
    }

    const fileEntry = getFileEntry(item.name)
    if (!fileEntry) {
      continue
    }

    const exportName = exportPrefix ? `${exportPrefix}/${fileEntry}` : fileEntry
    entries.push([`./${exportName}`, `./${sourceDir}/${item.name}`])
  }

  return entries.sort(([left], [right]) => left.localeCompare(right))
}

const packageJson = readPackageJson()

packageJson.exports = Object.fromEntries([
  ...getEntries('src/lib', 'lib'),
  ...getEntries('src/components', 'components'),
  ...getEntries('src/hoc', 'hoc'),
  ['./*', './*'],
])

delete packageJson.typesVersions

writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
