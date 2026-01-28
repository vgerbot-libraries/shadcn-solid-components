import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// Dynamically read all component directories
function getComponentEntries() {
  const componentsDir = join(process.cwd(), 'src/components')
  const entries: preset.PresetOptions['entries'] = []

  try {
    const items = readdirSync(componentsDir)

    for (const item of items) {
      const itemPath = join(componentsDir, item)
      const stat = statSync(itemPath)

      // Only process directories (skip index.ts)
      if (stat.isDirectory()) {
        const entryFile = join(itemPath, 'index.tsx')
        entries.push({
          entry: `src/components/${item}/index.tsx`,
          name: item,
        })
      }
    }
  } catch (error) {
    console.warn('Failed to read components directory:', error)
  }

  return entries
}

const preset_options: preset.PresetOptions = {
  entries: [
    // Main entry
    {
      entry: 'src/index.tsx',
      name: 'index'
    },
    // Lib utilities
    {
      entry: 'src/lib/index.ts',
      name: 'lib',
    },
    // Dynamically add all components
    ...getComponentEntries(),
  ],
  // Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
  drop_console: true,
  // Set to `true` to generate a CommonJS build alongside ESM
  // cjs: true,
}

const CI =
  process.env['CI'] === 'true' ||
  process.env['GITHUB_ACTIONS'] === 'true' ||
  process.env['CI'] === '"1"' ||
  process.env['GITHUB_ACTIONS'] === '"1"'

export default defineConfig(config => {
  const watching = !!config.watch

  const parsed_options = preset.parsePresetOptions(preset_options, watching)

  if (!watching && !CI) {
    const package_fields = preset.generatePackageExports(parsed_options)

    console.log(`package.json: \n\n${JSON.stringify(package_fields, null, 2)}\n\n`)

    // will update ./package.json with the correct export fields
    preset.writePackageJson(package_fields)
  }

  return preset.generateTsupOptions(parsed_options)
})
