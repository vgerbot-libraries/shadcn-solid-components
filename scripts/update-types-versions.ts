import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { getComponentEntries, getHocEntries } from './components.ts'

const packageJsonPath = resolve(process.cwd(), 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const entries = [
  { name: 'lib', entry: 'src/lib/index.ts' },
  ...getComponentEntries(),
  ...getHocEntries()
]

const typesVersions: Record<string, string[]> = {}

for (const entry of entries) {
  typesVersions[entry.name] = [`./dist/${entry.name}/index.d.ts`]
}

packageJson.typesVersions = {
  '*': typesVersions
}

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
console.log('Updated package.json typesVersions')
