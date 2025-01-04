type Unit = 'km' | 'mi';

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number, unit: Unit = 'km'): number {
	// Earth's average radius in kilometers and miles
	const radius = {
		km: 6371,
		mi: 3958.8,
	};

	if (!radius[unit]) {
		throw new Error("Invalid unit. Use 'km' for kilometers or 'mi' for miles.");
	}

	const R = radius[unit];
	const toRadians = (degree: number) => degree * (Math.PI / 180); // Convert degrees to radians

	// Calculate the differences in latitude and longitude
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	//Haversine
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;
	return distance;
}
