#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import {
  accessSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import inquirer from 'inquirer'

const PACKAGE_NAME = 'shadcn-solid-components'
const DEFAULT_OUT_DIR = 'src/lib/ssc'
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const LOCKFILE_BY_MANAGER = {
  pnpm: 'pnpm-lock.yaml',
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
}
const RESOLVABLE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.json']
const REQUIRED_METADATA_FIELDS = ['name', 'description', 'usage']

function writeStdout(message) {
  process.stdout.write(message)
}

function writeStderr(message) {
  process.stderr.write(message)
}

function fail(message) {
  writeStderr(`\n[ssc] ${message}\n`)
  process.exit(1)
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function normalizeSpecifier(input) {
  return input.replace(/^\.?\//, '').replace(new RegExp(`^${PACKAGE_NAME}/`), '')
}

function stripModuleExtension(specifier) {
  return specifier.replace(/\.(tsx?|jsx?|mjs|cjs)$/u, '')
}

function stripIndexSuffix(specifier) {
  if (specifier.endsWith('/index')) {
    const stripped = specifier.slice(0, -'/index'.length)
    return stripped || '.'
  }

  return specifier
}

function loadJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(
      `Unable to parse JSON: ${filePath}\n${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

function readMetadataDependencies(metadataPath, metadata) {
  if (metadata.dependencies == null) {
    return []
  }

  if (
    !Array.isArray(metadata.dependencies) ||
    metadata.dependencies.some(item => typeof item !== 'string')
  ) {
    fail(`Metadata field 'dependencies' must be string[]: ${metadataPath}`)
  }

  return metadata.dependencies
}

function resolvePackageRoot(cwd) {
  const require = createRequire(import.meta.url)

  let packageJsonPath
  try {
    packageJsonPath = require.resolve(`${PACKAGE_NAME}/package.json`, {
      paths: [cwd],
    })
  } catch {
    fail(
      `${PACKAGE_NAME} not found. Please install it in the current project before running. Example: pnpm add ${PACKAGE_NAME}`,
    )
  }

  return path.dirname(packageJsonPath)
}

function buildRegistry(packageRoot) {
  const packageJson = loadJson(path.join(packageRoot, 'package.json'))
  const exportsMap = packageJson.exports

  if (!exportsMap || typeof exportsMap !== 'object') {
    fail(`${PACKAGE_NAME} package.json is missing exports configuration`)
  }

  const registry = new Map()

  for (const [exportKey, exportValue] of Object.entries(exportsMap)) {
    if (!exportKey.startsWith('./') || exportKey === './*') {
      continue
    }

    if (typeof exportValue !== 'string') {
      continue
    }

    const specifier = exportKey.slice(2)
    if (
      !specifier.startsWith('components/') &&
      !specifier.startsWith('hoc/') &&
      !specifier.startsWith('mobile/') &&
      !specifier.startsWith('lib/') &&
      !specifier.startsWith('i18n/')
    ) {
      continue
    }

    const sourceRel = exportValue.replace(/^\.\//, '')
    if (!sourceRel.startsWith('src/')) {
      continue
    }

    const sourceAbs = path.join(packageRoot, sourceRel)
    const segments = specifier.split('/')
    const kind = segments[0]
    const isTopLevelInstallable =
      (kind === 'components' || kind === 'hoc' || kind === 'mobile') && segments.length === 2

    const entry = {
      specifier,
      kind,
      sourceAbs,
      metadataAbs: isTopLevelInstallable
        ? path.join(path.dirname(sourceAbs), '_metadata.json')
        : null,
    }

    registry.set(specifier, entry)
  }

  return registry
}

function validateMetadata(metadataPath, metadata) {
  for (const field of REQUIRED_METADATA_FIELDS) {
    if (metadata[field] == null || metadata[field] === '') {
      fail(`Metadata missing required field '${field}': ${metadataPath}`)
    }
  }
}

function readMetadataForEntry(entry) {
  if (!entry.metadataAbs) {
    return null
  }

  if (!existsSync(entry.metadataAbs)) {
    fail(`Missing metadata file: ${entry.metadataAbs}`)
  }

  const metadata = loadJson(entry.metadataAbs)
  validateMetadata(entry.metadataAbs, metadata)
  return metadata
}

function listInstallableEntries(registry) {
  const entries = Array.from(registry.values()).filter(
    entry =>
      (entry.kind === 'components' || entry.kind === 'hoc' || entry.kind === 'mobile') &&
      entry.specifier.split('/').length === 2,
  )

  entries.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind.localeCompare(b.kind)
    }

    return a.specifier.localeCompare(b.specifier)
  })

  return entries
}

function parseArgs(argv) {
  const command = argv[2]

  if (!command || command === '-h' || command === '--help' || command === 'help') {
    return { command: 'help' }
  }

  if (command === 'list') {
    return { command: 'list' }
  }

  if (command === 'add') {
    const names = []
    let outDir = DEFAULT_OUT_DIR
    let dryRun = false

    for (let index = 3; index < argv.length; index += 1) {
      const arg = argv[index]
      if (arg === '--dry-run') {
        dryRun = true
        continue
      }

      if (arg === '--out-dir' || arg === '-o') {
        const next = argv[index + 1]
        if (!next) {
          fail(`${arg} requires a path argument`)
        }

        outDir = next
        index += 1
        continue
      }

      if (arg.startsWith('--out-dir=')) {
        outDir = arg.slice('--out-dir='.length)
        continue
      }

      names.push(arg)
    }

    return { command: 'add', names, outDir, dryRun }
  }

  if (command === 'install') {
    const names = []
    let scanDir = '.'
    let dryRun = false

    for (let index = 3; index < argv.length; index += 1) {
      const arg = argv[index]

      if (arg === '--dry-run') {
        dryRun = true
        continue
      }

      if (arg === '--scan-dir' || arg === '-s') {
        const next = argv[index + 1]
        if (!next) {
          fail(`${arg} requires a path argument`)
        }

        scanDir = next
        index += 1
        continue
      }

      if (arg.startsWith('--scan-dir=')) {
        scanDir = arg.slice('--scan-dir='.length)
        continue
      }

      names.push(arg)
    }

    return { command: 'install', names, scanDir, dryRun }
  }

  fail(`Unknown command '${command}'. Available commands: list, add, install`)
}

function normalizeModuleSpecifier(specifier) {
  return specifier.split(/[?#]/u)[0] ?? specifier
}

function extractThirdPartyPackageName(specifier) {
  const normalized = normalizeModuleSpecifier(specifier)

  if (!normalized || normalized.startsWith('.') || normalized.startsWith('/')) {
    return null
  }

  if (
    normalized.startsWith('node:') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://')
  ) {
    return null
  }

  if (normalized === PACKAGE_NAME || normalized.startsWith(`${PACKAGE_NAME}/`)) {
    return null
  }

  if (normalized.startsWith('@')) {
    const parts = normalized.split('/')
    if (parts.length < 2) {
      return null
    }

    return `${parts[0]}/${parts[1]}`
  }

  const [name] = normalized.split('/')
  return name || null
}

function collectThirdPartyDependenciesFromFiles(files) {
  const deps = new Set()

  for (const filePath of files) {
    if (!CODE_EXTENSIONS.has(path.extname(filePath))) {
      continue
    }

    const content = readFileSync(filePath, 'utf8')
    const moduleSpecifiers = parseModuleSpecifiers(content)
    for (const specifier of moduleSpecifiers) {
      const packageName = extractThirdPartyPackageName(specifier)
      if (packageName) {
        deps.add(packageName)
      }
    }
  }

  return Array.from(deps)
}

function collectDependenciesFromEntries(entries, registry) {
  const deps = new Set()

  for (const entry of entries) {
    const metadata = readMetadataForEntry(entry)
    const metadataDeps = readMetadataDependencies(entry.metadataAbs, metadata)

    if (metadataDeps.length > 0) {
      for (const dep of metadataDeps) {
        deps.add(dep)
      }
      continue
    }

    const files = collectCopyFiles([entry], registry)
    const fallbackDeps = collectThirdPartyDependenciesFromFiles(files)
    for (const dep of fallbackDeps) {
      deps.add(dep)
    }
  }

  return Array.from(deps).sort((a, b) => a.localeCompare(b))
}

function scanFilesFallback(scanDirAbs, ignoredDirNames) {
  const files = []
  const queue = [scanDirAbs]

  while (queue.length > 0) {
    const current = queue.shift()

    let stats
    try {
      stats = statSync(current)
    } catch {
      continue
    }

    if (stats.isDirectory()) {
      const baseName = path.basename(current)
      if (ignoredDirNames.has(baseName)) {
        continue
      }

      const children = readdirSync(current)
      for (const child of children) {
        queue.push(path.join(current, child))
      }
      continue
    }

    if (stats.isFile() && CODE_EXTENSIONS.has(path.extname(current))) {
      files.push(current)
    }
  }

  return files
}

function listCodeFilesWithGitIgnore(cwd, scanDirAbs) {
  const gitArgs = ['ls-files', '--cached', '--others', '--exclude-standard', scanDirAbs]

  try {
    const output = execFileSync('git', gitArgs, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })

    return output
      .split(/\r?\n/u)
      .filter(Boolean)
      .map(item => path.resolve(cwd, item))
      .filter(filePath => CODE_EXTENSIONS.has(path.extname(filePath)))
  } catch {
    return scanFilesFallback(scanDirAbs, new Set(['.git', 'node_modules', 'dist', 'temp']))
  }
}

function collectUsedInstallableEntriesFromProject({
  scanDirAbs,
  cwd,
  registry,
  installableEntries,
}) {
  const entries = []
  const seen = new Set()
  const installableMap = new Map(installableEntries.map(entry => [entry.specifier, entry]))
  const codeFiles = listCodeFilesWithGitIgnore(cwd, scanDirAbs)

  for (const filePath of codeFiles) {
    const content = readFileSync(filePath, 'utf8')
    const moduleSpecifiers = parseModuleSpecifiers(content)

    for (const rawSpecifier of moduleSpecifiers) {
      const specifier = normalizeModuleSpecifier(rawSpecifier)
      let installSpecifier = null

      if (specifier.startsWith(`${PACKAGE_NAME}/`)) {
        installSpecifier = specifier.slice(`${PACKAGE_NAME}/`.length)
      } else {
        const match = specifier.match(/(?:^|\/)(components|hoc|mobile)\/([^/]+)/u)
        if (match) {
          installSpecifier = `${match[1]}/${match[2]}`
        }
      }

      if (!installSpecifier) {
        continue
      }

      const entry = registry.get(installSpecifier)
      if (!entry || !installableMap.has(installSpecifier)) {
        continue
      }

      if (!seen.has(entry.specifier)) {
        seen.add(entry.specifier)
        entries.push(entry)
      }
    }
  }

  return entries
}

function detectPackageManager(cwd) {
  const packageJsonPath = path.join(cwd, 'package.json')

  if (existsSync(packageJsonPath)) {
    const packageJson = loadJson(packageJsonPath)
    if (typeof packageJson.packageManager === 'string') {
      const value = packageJson.packageManager.toLowerCase()
      for (const manager of ['pnpm', 'npm', 'yarn']) {
        if (value.startsWith(manager)) {
          return manager
        }
      }
    }
  }

  for (const [manager, lockfile] of Object.entries(LOCKFILE_BY_MANAGER)) {
    if (existsSync(path.join(cwd, lockfile))) {
      return manager
    }
  }

  fail(
    'Cannot detect package manager. Set package.json.packageManager or add a lock file (pnpm-lock.yaml / package-lock.json / yarn.lock).',
  )
}

function runInstall({ cwd, manager, packages, dryRun }) {
  const commandByManager = {
    pnpm: { command: 'pnpm', args: ['add', ...packages] },
    npm: { command: 'npm', args: ['install', ...packages] },
    yarn: { command: 'yarn', args: ['add', ...packages] },
  }

  const command = commandByManager[manager]
  if (!command) {
    fail(`Unsupported package manager '${manager}'`)
  }

  const commandLine = `${command.command} ${command.args.join(' ')}`

  if (dryRun) {
    writeStdout(`[ssc] dry-run install command: ${commandLine}\n`)
    return
  }

  execFileSync(command.command, command.args, {
    cwd,
    stdio: 'inherit',
  })
}

function resolveInstallSelection(names, installableEntries) {
  const bySpecifier = new Map(installableEntries.map(entry => [entry.specifier, entry]))
  const byBasename = new Map()

  for (const entry of installableEntries) {
    const shortName = entry.specifier.split('/').at(-1)
    const list = byBasename.get(shortName) ?? []
    list.push(entry)
    byBasename.set(shortName, list)
  }

  const selected = []
  const seen = new Set()

  for (const rawName of names) {
    const normalized = normalizeSpecifier(rawName)

    let entry = bySpecifier.get(normalized)
    if (!entry && !normalized.includes('/')) {
      const candidates = byBasename.get(normalized) ?? []
      if (candidates.length > 1) {
        fail(
          `Component name '${rawName}' is not unique, please use the full name: ${candidates
            .map(item => item.specifier)
            .join(', ')}`,
        )
      }

      entry = candidates[0]
    }

    if (!entry) {
      fail(`Component '${rawName}' not found`)
    }

    if (!seen.has(entry.specifier)) {
      selected.push(entry)
      seen.add(entry.specifier)
    }
  }

  return selected
}
async function chooseEntriesWithKeyboard(installableEntries, initialOutDir) {
  const groups = {
    components: installableEntries.filter(entry => entry.kind === 'components'),
    hoc: installableEntries.filter(entry => entry.kind === 'hoc'),
    mobile: installableEntries.filter(entry => entry.kind === 'mobile'),
  }

  const choices = []

  const appendGroup = (label, entries) => {
    if (entries.length === 0) {
      return
    }

    choices.push(new inquirer.Separator(`= ${label} =`))
    for (const entry of entries) {
      const metadata = readMetadataForEntry(entry)
      choices.push({
        name: `${entry.specifier} - ${metadata.description}`,
        value: entry.specifier,
      })
    }
  }

  appendGroup('components', groups.components)
  appendGroup('hoc', groups.hoc)
  appendGroup('mobile', groups.mobile)

  const { selectedSpecifiers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedSpecifiers',
      message: 'Select components to add (↑↓ to move, space to select, enter to confirm)',
      pageSize: 20,
      loop: false,
      choices,
      validate: value => {
        if (!Array.isArray(value) || value.length === 0) {
          return 'Select at least one component'
        }

        return true
      },
    },
  ])

  const { outDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outDir',
      message: 'Output directory (press enter to use default)',
      default: initialOutDir,
      validate: value => {
        if (!String(value ?? '').trim()) {
          return 'Output directory cannot be empty'
        }

        return true
      },
    },
  ])

  return {
    entries: resolveInstallSelection(selectedSpecifiers, installableEntries),
    outDir,
  }
}

function parseModuleSpecifiers(content) {
  const specs = new Set()
  const patterns = [
    /import\s+[^'"\n]*?from\s+['"]([^'"\n]+)['"]/gu,
    /export\s+[^'"\n]*?from\s+['"]([^'"\n]+)['"]/gu,
    /import\s*['"]([^'"\n]+)['"]/gu,
  ]

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const spec = match[1]
      if (spec) {
        specs.add(spec)
      }
    }
  }

  return Array.from(specs)
}

function resolveRelativeImport(fromFile, specifier) {
  const absBase = path.resolve(path.dirname(fromFile), specifier)

  const candidates = [absBase]
  for (const extension of RESOLVABLE_EXTENSIONS) {
    candidates.push(`${absBase}${extension}`)
  }

  for (const extension of RESOLVABLE_EXTENSIONS) {
    candidates.push(path.join(absBase, `index${extension}`))
  }

  for (const candidate of candidates) {
    try {
      accessSync(candidate)
      return candidate
    } catch {
      // keep probing
    }
  }

  return null
}

function collectCopyFiles(selectedEntries, registry) {
  const queue = []
  const visited = new Set()
  const files = new Set()

  const enqueue = filePath => {
    if (!visited.has(filePath)) {
      visited.add(filePath)
      queue.push(filePath)
    }
  }

  for (const entry of selectedEntries) {
    enqueue(entry.sourceAbs)
    if (entry.metadataAbs && existsSync(entry.metadataAbs)) {
      files.add(entry.metadataAbs)
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()
    files.add(current)

    const extension = path.extname(current)
    if (!CODE_EXTENSIONS.has(extension)) {
      continue
    }

    const content = readFileSync(current, 'utf8')
    const deps = parseModuleSpecifiers(content)

    for (const dep of deps) {
      if (dep.startsWith(`${PACKAGE_NAME}/`)) {
        const inner = dep.slice(`${PACKAGE_NAME}/`.length)
        const target = registry.get(inner)
        if (!target) {
          continue
        }

        enqueue(target.sourceAbs)
        if (target.metadataAbs && existsSync(target.metadataAbs)) {
          files.add(target.metadataAbs)
        }
        continue
      }

      if (dep.startsWith('.')) {
        const resolved = resolveRelativeImport(current, dep)
        if (resolved) {
          enqueue(resolved)
        }
      }
    }
  }

  return files
}

function rewritePackageImports(content, sourceFile, srcRootAbs, outRootAbs, registry) {
  const sourceRel = path.relative(srcRootAbs, sourceFile)
  const destSourceAbs = path.join(outRootAbs, sourceRel)

  const replacer = (fullMatch, prefix, specifier, suffix) => {
    if (!specifier.startsWith(`${PACKAGE_NAME}/`)) {
      return fullMatch
    }

    const inner = specifier.slice(`${PACKAGE_NAME}/`.length)
    const target = registry.get(inner)
    if (!target) {
      return fullMatch
    }

    const targetRel = path.relative(srcRootAbs, target.sourceAbs)
    const destTargetAbs = path.join(outRootAbs, targetRel)
    let nextSpecifier = toPosix(path.relative(path.dirname(destSourceAbs), destTargetAbs))

    if (!nextSpecifier.startsWith('.')) {
      nextSpecifier = `./${nextSpecifier}`
    }

    nextSpecifier = stripIndexSuffix(stripModuleExtension(nextSpecifier))

    return `${prefix}${nextSpecifier}${suffix}`
  }

  let next = content
  next = next.replace(/(from\s+['"])(shadcn-solid-components\/[^'"]+)(['"])/gu, replacer)
  next = next.replace(/(import\s+['"])(shadcn-solid-components\/[^'"]+)(['"])/gu, replacer)

  return next
}

function executeCopy({ files, srcRootAbs, outRootAbs, cwd, dryRun, registry }) {
  const operations = []
  const conflicts = []

  for (const sourceAbs of files) {
    const sourceRel = path.relative(srcRootAbs, sourceAbs)
    if (sourceRel.startsWith('..')) {
      continue
    }

    const destAbs = path.join(outRootAbs, sourceRel)
    operations.push({ sourceAbs, destAbs, sourceRel })

    if (existsSync(destAbs)) {
      conflicts.push(sourceRel)
    }
  }

  if (conflicts.length > 0) {
    fail(
      `Target directory contains files with the same name; will not overwrite by default. Please resolve and retry.\nConflicting files:\n- ${conflicts
        .slice(0, 10)
        .join('\n- ')}${conflicts.length > 10 ? '\n- ...' : ''}`,
    )
  }

  if (dryRun) {
    writeStdout('[ssc] dry-run preview:\n')
    for (const op of operations) {
      writeStdout(`  + ${toPosix(path.relative(cwd, op.destAbs))}\n`)
    }

    return operations.length
  }

  for (const op of operations) {
    mkdirSync(path.dirname(op.destAbs), { recursive: true })
    const extension = path.extname(op.sourceAbs)

    if (CODE_EXTENSIONS.has(extension)) {
      const original = readFileSync(op.sourceAbs, 'utf8')
      const rewritten = rewritePackageImports(
        original,
        op.sourceAbs,
        srcRootAbs,
        outRootAbs,
        registry,
      )
      writeFileSync(op.destAbs, rewritten)
      continue
    }

    const raw = readFileSync(op.sourceAbs)
    writeFileSync(op.destAbs, raw)
  }

  return operations.length
}
function printList(installableEntries) {
  const sections = {
    components: [],
    hoc: [],
    mobile: [],
  }

  for (const entry of installableEntries) {
    const metadata = readMetadataForEntry(entry)
    sections[entry.kind].push({ entry, metadata })
  }

  for (const key of ['components', 'hoc', 'mobile']) {
    const group = sections[key]
    if (!group || group.length === 0) {
      continue
    }

    writeStdout(`\n${key.toUpperCase()} (${group.length})\n`)
    for (const item of group) {
      writeStdout(`- ${item.entry.specifier}: ${item.metadata.description}\n`)
    }
  }

  writeStdout('\n')
}

function printHelp() {
  writeStdout(`
ssc - shadcn-solid-components CLI

Commands:
  ssc list
    List available components/hoc/mobile (with descriptions)

  ssc add <name...> [--out-dir <path>] [--dry-run]
    Add one or more components to the project directory

  ssc add
    Enter interactive multi-select mode when no arguments are provided

  ssc install [name...] [--scan-dir <path>] [--dry-run]
    Install third-party dependencies from metadata.
    - with names: install dependencies for specified components/hoc/mobile
    - without names: scan project usage and install matched dependencies
`)
}

async function main() {
  const parsed = parseArgs(process.argv)

  if (parsed.command === 'help') {
    printHelp()
    return
  }

  const cwd = process.cwd()
  const packageRoot = resolvePackageRoot(cwd)
  const srcRootAbs = path.join(packageRoot, 'src')
  const registry = buildRegistry(packageRoot)
  const installableEntries = listInstallableEntries(registry)

  if (parsed.command === 'list') {
    printList(installableEntries)
    return
  }

  if (parsed.command === 'add') {
    let selectedEntries = []
    let outDir = parsed.outDir

    if (parsed.names.length === 0) {
      const interactiveResult = await chooseEntriesWithKeyboard(installableEntries, outDir)
      selectedEntries = interactiveResult.entries
      outDir = interactiveResult.outDir
    } else {
      selectedEntries = resolveInstallSelection(parsed.names, installableEntries)
    }

    const outRootAbs = path.resolve(cwd, outDir)
    const files = collectCopyFiles(selectedEntries, registry)

    const copiedCount = executeCopy({
      files,
      srcRootAbs,
      outRootAbs,
      cwd,
      dryRun: parsed.dryRun,
      registry,
    })

    const selectedNames = selectedEntries.map(entry => entry.specifier).join(', ')
    const outDisplay = toPosix(path.relative(cwd, outRootAbs) || outDir)

    if (parsed.dryRun) {
      writeStdout(
        `\n[ssc] dry-run complete: ${copiedCount} files will be written to ${outDisplay}\n`,
      )
      writeStdout(`[ssc] Components: ${selectedNames}\n\n`)
      return
    }

    writeStdout(`\n[ssc] Add complete: ${copiedCount} files written to ${outDisplay}\n`)
    writeStdout(`[ssc] Components: ${selectedNames}\n\n`)
    return
  }

  if (parsed.command === 'install') {
    let selectedEntries = []

    if (parsed.names.length > 0) {
      selectedEntries = resolveInstallSelection(parsed.names, installableEntries)
    } else {
      const scanDirAbs = path.resolve(cwd, parsed.scanDir)
      if (!existsSync(scanDirAbs)) {
        fail(`Scan directory does not exist: ${scanDirAbs}`)
      }

      selectedEntries = collectUsedInstallableEntriesFromProject({
        scanDirAbs,
        cwd,
        registry,
        installableEntries,
      })
    }

    if (selectedEntries.length === 0) {
      if (parsed.names.length > 0) {
        fail('No matching components/hoc/mobile found for installation')
      }

      writeStdout('[ssc] No used components/hoc/mobile detected; nothing to install.\n')
      return
    }

    const packages = collectDependenciesFromEntries(selectedEntries, registry)
    if (packages.length === 0) {
      writeStdout('[ssc] No third-party dependencies found in selected metadata.\n')
      return
    }

    const manager = detectPackageManager(cwd)
    const selectedNames = selectedEntries
      .map(entry => entry.specifier)
      .sort((a, b) => a.localeCompare(b))

    writeStdout(`[ssc] Package manager: ${manager}\n`)
    writeStdout(`[ssc] Components: ${selectedNames.join(', ')}\n`)
    writeStdout(`[ssc] Dependencies: ${packages.join(', ')}\n`)

    runInstall({
      cwd,
      manager,
      packages,
      dryRun: parsed.dryRun,
    })

    if (parsed.dryRun) {
      writeStdout('[ssc] dry-run complete.\n')
      return
    }

    writeStdout('[ssc] Install complete.\n')
  }
}

main().catch(error => {
  fail(error instanceof Error ? error.message : String(error))
})
