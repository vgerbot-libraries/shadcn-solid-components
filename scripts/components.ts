import { readdirSync, statSync } from 'fs'
import { join } from 'path'

interface ComponentEntry {
  entry: string
  name: string
}

/**
 * Dynamically read all component directories and generate entry points
 * @returns Array of component entry configurations
 */
export function getComponentEntries(): ComponentEntry[] {
  const componentsDir = join(process.cwd(), 'src/components')
  const entries: ComponentEntry[] = []

  try {
    const items = readdirSync(componentsDir)

    for (const item of items) {
      const itemPath = join(componentsDir, item)
      const stat = statSync(itemPath)

      // Only process directories (skip index.ts)
      if (stat.isDirectory()) {
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

