import { readdirSync, statSync, copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Dynamically read all theme files from src/themes directory
 * @returns Array of theme file names
 */
export function getThemeFiles(): string[] {
  const themesDir = join(process.cwd(), 'src/themes')
  const themeFiles: string[] = []

  try {
    if (existsSync(themesDir)) {
      const items = readdirSync(themesDir)

      for (const item of items) {
        const itemPath = join(themesDir, item)
        const stat = statSync(itemPath)

        // Only process CSS files
        if (stat.isFile() && item.endsWith('.css')) {
          themeFiles.push(item)
        }
      }
    }
  } catch (error) {
    console.warn('Failed to read themes directory:', error)
  }

  return themeFiles
}

/**
 * Copy themes directory to dist/themes
 * This function copies all CSS files from src/themes to dist/themes
 */
export function copyThemesToDist(): void {
  const themesDir = join(process.cwd(), 'src/themes')
  const distThemesDir = join(process.cwd(), 'dist/themes')

  try {
    if (!existsSync(themesDir)) {
      console.warn('Themes directory does not exist:', themesDir)
      return
    }

    // Create dist/themes directory if it doesn't exist
    if (!existsSync(distThemesDir)) {
      mkdirSync(distThemesDir, { recursive: true })
    }

    const themeFiles = getThemeFiles()

    for (const file of themeFiles) {
      const srcPath = join(themesDir, file)
      const destPath = join(distThemesDir, file)
      copyFileSync(srcPath, destPath)
      console.log(`Copied theme file: ${file}`)
    }

    console.log(`Successfully copied ${themeFiles.length} theme file(s) to dist/themes`)
  } catch (error) {
    console.error('Failed to copy themes directory:', error)
  }
}

