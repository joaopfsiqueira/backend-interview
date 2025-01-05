import { Weights } from '../enum/weight.enum';
import { IPatient } from '../../model/patient.model';
import { IMinMaxValues, IGeolocation, ICalculations } from '../../utils/interfaces/utils/calculations.interface';
import { TUnit, TRange } from '../types/types';

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

				// add distance and total offers to the patient object
				patient.distance = distance;
				patient.totalOffers = patient.acceptedOffers + patient.canceledOffers;

				// age
				accumulator.age.min = Math.min(accumulator.age.min, patient.age);
				accumulator.age.max = Math.max(accumulator.age.max, patient.age);

				// accepted offers
				accumulator.accepted.min = Math.min(accumulator.accepted.min, patient.acceptedOffers);
				accumulator.accepted.max = Math.max(accumulator.accepted.max, patient.acceptedOffers);

				// canceled offers
				accumulator.canceled.min = Math.min(accumulator.canceled.min, patient.canceledOffers);
				accumulator.canceled.max = Math.max(accumulator.canceled.max, patient.canceledOffers);

				// total offers, I'll need to define "little behavior data"
				accumulator.totalOffers.min = Math.min(accumulator.totalOffers.min, patient.acceptedOffers + patient.canceledOffers);
				accumulator.totalOffers.max = Math.max(accumulator.totalOffers.max, patient.acceptedOffers + patient.canceledOffers);

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
				totalOffers: {
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

	haversineMethod(lat1: number, lon1: number, lat2: number, lon2: number, unit: TUnit = 'km'): number {
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
		if (patient.distance === undefined) {
			throw new Error('Distance is not defined');
		}
		// Calculate the score for each patient using normalization and weight application
		const age_norm = this.minMaxNormalization(patient.age, minMaxValues.age);
		const accepted_norm = this.minMaxNormalization(patient.acceptedOffers, minMaxValues.accepted);

		// Invert the values for canceled offers and reply time to give more weight to lower values
		// The lower the number of canceled offers, distance and the lower the average reply time, the better
		const distance_norm_inv = this.minMaxNormalizationTheSmallerTheBetter(patient.distance, minMaxValues.distance);
		const canceled_norm_inv = this.minMaxNormalizationTheSmallerTheBetter(patient.canceledOffers, minMaxValues.canceled);
		const reply_norm_inv = this.minMaxNormalizationTheSmallerTheBetter(patient.averageReplyTime, minMaxValues.reply);

		// transform the score to a 0-10 scale
		const score = Number(
			(this.weightApplication(age_norm, distance_norm_inv, accepted_norm, canceled_norm_inv, reply_norm_inv)! * 10).toFixed(2),
		);
		// garantee that the score is never 0, 1 as the lowest value.

		patient.score = score < 1 ? 1 : score;

		// calculing the behavior of the patient, if the patient has little behavior data he will be able to be select randomly in the list
		this.littleBehaviorCalculator(patient, minMaxValues.totalOffers);
	}

	minMaxNormalization(value: number, range: TRange): number {
		return (value - range.min) / (range.max - range.min);
	}

	minMaxNormalizationTheSmallerTheBetter(value: number, range: TRange): number {
		return 1 - (value - range.min) / (range.max - range.min);
	}

	weightApplication(
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

	littleBehaviorCalculator(patient: IPatient, range: TRange): void {
		const normalizedTotal = this.minMaxNormalization(patient.totalOffers!, range) * 10;
		// if the patient has little behavior data, the score will be 1 or 10%, at this point!
		if (normalizedTotal <= 1) {
			patient.behavior = false;
		} else {
			patient.behavior = true;
		}
	}
}

export default Calculations;
