import { defineConfig } from 'tsdown'
import solid from 'unplugin-solid/rolldown'
import {
  getComponentEntries,
  copyThemesToDist
} from './scripts'
import { getHocEntries } from './scripts/components'

const entries = {
  'lib': 'src/lib/index.ts',
  ...Object.fromEntries(getComponentEntries().map(e => [e.name, e.entry])),
  ...Object.fromEntries(getHocEntries().map(e => [e.name, e.entry])),
}

export default defineConfig({
  entry: entries,
  format: 'esm',
  platform: 'neutral',
  dts: true,
  clean: true,
  plugins: [solid()],
  inputOptions: {
    jsx: 'preserve',
  },
  exports: {
    all: true,
  },
  outExtensions: () => ({ js: '.js' }),
  onSuccess: async () => {
    copyThemesToDist()
  },
})
