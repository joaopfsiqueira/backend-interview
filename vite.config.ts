import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 90,
		},
	},
});
