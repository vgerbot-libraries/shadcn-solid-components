import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Update package.json files field to include dist/themes
 * This ensures that theme files are included in the published package
 */
export function updatePackageJsonFiles(): void {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    // Get current files array or initialize it
    const files = packageJson.files || []

    // Add dist/themes if not already present
    if (!files.includes('dist/themes')) {
      files.push('dist/themes')
    }

    // Remove old tailwind.preset.css if it exists (if you're moving to themes)
    const tailwindPresetIndex = files.indexOf('tailwind.preset.css')
    if (tailwindPresetIndex !== -1) {
      files.splice(tailwindPresetIndex, 1)
    }

    packageJson.files = files

    // Write back to package.json
    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    )

    console.log('Updated package.json files field')
  } catch (error) {
    console.error('Failed to update package.json:', error)
  }
}

