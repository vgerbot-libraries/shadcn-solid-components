import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'
import {
  getComponentEntries,
  copyThemesToDist,
  updatePackageJsonFiles,
} from './scripts'

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

  const tsupOptions = preset.generateTsupOptions(parsed_options)

  // Handle both array and object return types from generateTsupOptions
  if (Array.isArray(tsupOptions)) {
    // If it's an array, add onSuccess to each option
    return tsupOptions.map((option: any) => ({
      ...option,
      onSuccess: async () => {
        // Copy themes directory
        copyThemesToDist()

        // Update package.json files field
        updatePackageJsonFiles()

        // Call original onSuccess if it exists
        if (typeof option.onSuccess === 'function') {
          await option.onSuccess()
        }
      },
    }))
  } else {
    // If it's a single object, add onSuccess to it
    const options = tsupOptions as any
    return {
      ...options,
      onSuccess: async () => {
        // Copy themes directory
        copyThemesToDist()

        // Update package.json files field
        updatePackageJsonFiles()

        // Call original onSuccess if it exists
        if (typeof options.onSuccess === 'function') {
          await options.onSuccess()
        }
      },
    }
  }
})
