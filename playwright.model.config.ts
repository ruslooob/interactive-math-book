import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*model.spec.ts',
  outputDir: './tests/.artifacts/model',
  fullyParallel: true,
})
