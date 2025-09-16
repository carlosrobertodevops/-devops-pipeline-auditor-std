import type { Config } from 'jest'

const config: Config = {
  displayName: 'unit',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFiles: ['dotenv/config']
}
export default config