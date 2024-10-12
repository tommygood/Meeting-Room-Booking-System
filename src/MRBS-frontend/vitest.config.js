import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
<<<<<<< HEAD
      root: fileURLToPath(new URL('./', import.meta.url)),
      globalSetup: './vitest.global-setup.ts',
=======
      root: fileURLToPath(new URL('./', import.meta.url))
>>>>>>> 3c1e13b14ce5178a1bb9cca590dda1a60f3a5fb9
    }
  })
)
