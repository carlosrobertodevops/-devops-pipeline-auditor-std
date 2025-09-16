import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Ajuste conforme sua base de código:
  testMatch: ['<rootDir>/**/__tests__/**/*.(spec|test).{ts,tsx,js,jsx}'],
}

export default createJestConfig(customJestConfig)