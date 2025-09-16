import nextJest from 'next/jest.js'

// Como o projeto Next está “aninhado” em /src, apontamos para ele.
const createJestConfig = nextJest({ dir: './' })

const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)']
}

export default createJestConfig(customConfig)