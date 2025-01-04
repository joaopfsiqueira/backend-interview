import { Weights } from '../enum/weight.enum';
import IPatient from '../../model/patient.model';
import { IMinMaxValues, IGeolocation, ICalculations } from '../../interfaces/utils/calculations.interface';
import { Unit, Range } from '../types/types';

class Calculations implements ICalculations {
	minMaxFinder(patients: IPatient[], reference: IGeolocation): IMinMaxValues {
		//if or Math.min and Math.max, both are used to find the minimum and maximum values in an array
		// using infinity and -infinity as initial values to compare with the first element of the array
		// and update the min and max values accordingly in the reduce function, will help with 0  and null values in the beginning
		return patients.reduce<IMinMaxValues>(
			(accumulator, patient) => {
				const distance = this.haversineMethod(
					parseFloat(patient.location.latitude),
					parseFloat(patient.location.longitude),
					reference.latitude,
					reference.longitude,
				);

				patient.distance = distance;

				// age
				accumulator.age.min = Math.min(accumulator.age.min, patient.age);
				accumulator.age.max = Math.max(accumulator.age.max, patient.age);

				// accepted offers
				accumulator.accepted.min = Math.min(accumulator.accepted.min, patient.acceptedOffers);
				accumulator.accepted.max = Math.max(accumulator.accepted.max, patient.acceptedOffers);

				// canceled offers
				accumulator.canceled.min = Math.min(accumulator.canceled.min, patient.canceledOffers);
				accumulator.canceled.max = Math.max(accumulator.canceled.max, patient.canceledOffers);

				// reply time
				accumulator.reply.min = Math.min(accumulator.reply.min, patient.averageReplyTime);
				accumulator.reply.max = Math.max(accumulator.reply.max, patient.averageReplyTime);

				// distance
				accumulator.distance.min = Math.min(accumulator.distance.min, distance);
				accumulator.distance.max = Math.max(accumulator.distance.max, distance);
				return accumulator;
			},
			{
				age: {
					min: Infinity,
					max: -Infinity,
				},
				accepted: {
					min: Infinity,
					max: -Infinity,
				},
				canceled: {
					min: Infinity,
					max: -Infinity,
				},
				reply: {
					min: Infinity,
					max: -Infinity,
				},
				distance: {
					min: Infinity,
					max: -Infinity,
				},
			},
		);
	}

	haversineMethod(lat1: number, lon1: number, lat2: number, lon2: number, unit: Unit = 'km'): number {
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

	patientScoreCalculator(patient: IPatient, minMaxValues: IMinMaxValues): void {
		// Calculate the score for each patient using normalization and weight application
		const age_norm = this.minMaxNormalization(patient.age, minMaxValues.age);

		if (patient.distance === undefined) {
			throw new Error('Distance is not defined');
		}
		const distance_norm = this.minMaxNormalization(patient.distance, minMaxValues.distance);
		const accepted_norm = this.minMaxNormalization(patient.acceptedOffers, minMaxValues.accepted);

		// Invert the values for canceled offers and reply time to give more weight to lower valuesß
		const canceled_norm_inv = 1 - this.minMaxNormalization(patient.canceledOffers, minMaxValues.canceled);
		const reply_norm_inv = 1 - this.minMaxNormalization(patient.averageReplyTime, minMaxValues.reply);

		const score = this.WeightApplication(age_norm, distance_norm, accepted_norm, canceled_norm_inv, reply_norm_inv);
		patient.score = score;
	}

	minMaxNormalization(value: number, range: Range): number {
		return (value - range.min) / (range.max - range.min);
	}

	WeightApplication(
		age_norm: number,
		distance_norm: number,
		accepted_norm: number,
		canceled_norm_inv: number,
		reply_norm_inv: number,
	): number {
		return (
			age_norm * Weights.AGE +
			distance_norm * Weights.DISTANCE +
			accepted_norm * Weights.ACCEPTED_OFFERS +
			canceled_norm_inv * Weights.CANCELED_OFFERS +
			reply_norm_inv * Weights.REPLY_TIME
		);
	}
}

export default Calculations;
