import { existsSync, fstat, readdirSync, statSync } from 'fs'
import path, { join } from 'path'

interface ComponentEntry {
  entry: string
  name: string
}

/**
 * Dynamically read all component directories and generate entry points
 * @returns Array of component entry configurations
 */
export function getComponentEntries(): ComponentEntry[] {
  return _getComponentEntries('src/components')
}


export function getHocEntries(): ComponentEntry[] {
  return _getComponentEntries('src/hoc').map(it => {
    return {
      ...it,
      name: 'hoc/' + it.name
    }
  })
}

function _getComponentEntries(dir: string): ComponentEntry[] {
  const componentsDir = join(process.cwd(), dir)
  const entries: ComponentEntry[] = []

  try {
    const items = readdirSync(componentsDir)

    for (const item of items) {
      const itemPath = join(componentsDir, item)
      const stat = statSync(itemPath)

      // Only process directories (skip index.ts)
      if (stat.isDirectory()) {
        let entry = `${dir}/${item}/index.tsx`;
        if(existsSync(path.resolve(componentsDir, item, 'index.ts'))) {
            entry = `${dir}/${item}/index.ts`;1
        }
        entries.push({
          entry,
          name: item,
        })
      }
    }
  } catch (error) {
    console.warn('Failed to read components directory:', error)
  }

  return entries
}
