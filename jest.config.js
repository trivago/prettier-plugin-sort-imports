const ENABLE_COVERAGE = false; // !!process.env.CI;

export default {
    displayName: 'test',
    setupFiles: ['<rootDir>/test-setup/run_spec.cjs'],
    snapshotSerializers: ['<rootDir>/test-setup/raw-serializer.cjs'],
    testRegex: 'ppsi\\.spec\\.js$|__tests__/.*\\.ts$',
    collectCoverage: ENABLE_COVERAGE,
    collectCoverageFrom: ['src/**/*.ts', '!<rootDir>/node_modules/'],
    preset: 'ts-jest',
    testEnvironment: 'node',
};