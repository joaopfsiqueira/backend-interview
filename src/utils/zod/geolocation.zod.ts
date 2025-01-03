import { z } from 'zod';

export const GeolocationSchema = z.object({
	latitude: z
		.number({
			required_error: 'latitude is required',
			invalid_type_error: 'latitude must be a number! Example: 46.7110',
		})
		.min(-90)
		.max(90),
	longitude: z
		.number({
			required_error: 'longitude is required',
			invalid_type_error: 'longitude must be a number! Example: -63.1150',
		})
		.min(-180)
		.max(180),
});
