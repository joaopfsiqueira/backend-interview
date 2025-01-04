// because of the property "noPropertyAccessFromIndexSignature": true in tsconfig.ts, I need to create a global .env interface, either this or use process.env.[variable]]
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: number;
		}
	}
}

export {};
