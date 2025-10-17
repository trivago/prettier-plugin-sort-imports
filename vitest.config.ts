import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./test-setup/run_spec.mjs'],
        include: [
            'src/**/*.{test,spec}.{js,mjs,ts}',
            'tests/**/*.{test,spec}.{js,mjs,ts}',
        ],
    },
});
