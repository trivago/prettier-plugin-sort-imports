"use strict";

const ENABLE_COVERAGE = false; // !!process.env.CI;

module.exports = {
    displayName: "test",
    setupFiles: ["<rootDir>/test-setup/run_spec.js"],
    snapshotSerializers: ["<rootDir>/test-setup/raw-serializer.js"],
    testRegex: "ppsi\\.spec\\.js$|__tests__/.*\\.ts$",
    collectCoverage: ENABLE_COVERAGE,
    collectCoverageFrom: ["src/**/*.ts", "!<rootDir>/node_modules/"],
    preset: 'ts-jest',
    testEnvironment: 'node',
};
