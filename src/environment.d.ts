// because of the property "noPropertyAccessFromIndexSignature": true in tsconfig.ts, I need to create a global .env interface, either this or use process.env.[variable]]
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			PORT: number;
			TOTAL_TOP_PATIENTS: number;
			TOTAL_RANDOM_PATIENTS: number;
		}
	}
}

export {};
