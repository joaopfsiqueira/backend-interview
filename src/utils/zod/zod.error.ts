import { ZodIssue } from 'zod';

// format error message from Zod
export function ErrorZodFormat(errors: ZodIssue[]): string {
	let errorZod = '';

	errors.forEach((error: ZodIssue) => {
		errorZod += error.message + ', ';
	});

	// removendo a última vírgula e espaço
	errorZod = errorZod.slice(0, errorZod.length - 2);
	console.log(errorZod);

	return errorZod;
}
