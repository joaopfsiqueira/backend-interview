import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	test: {
		mockReset: true,
		globals: true,
		environment: 'node',
		coverage: {
			exclude: [
				'**/node_modules/**',
				'**/src/model/**',
				'**/dist/**',
				'**/src/utils/interfaces/**',
				'**/src/utils/types/**',
				'**/vite.config.ts',
				'**/src/environment.d.ts',
				'**/src/app.ts',
				'**/src/server.ts',
			],
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 90,
		},
	},
});
