import IPatient from '../../model/patient.model';
import { Unit, Range } from '../../utils/types/types';

export interface ICalculations {
	minMaxFinder(patients: IPatient[], reference: IGeolocation): IMinMaxValues;
	haversineMethod(lat1: number, lon1: number, lat2: number, lon2: number, unit?: Unit): number;
	patientScoreCalculator(patient: IPatient, minMaxValues: IMinMaxValues): void;
	minMaxNormalization(value: number, range: Range): number;
	minMaxNormalizationTheSmallerTheBetter(value: number, range: Range): number;
	WeightApplication(
		age_norm: number,
		distance_norm: number,
		accepted_norm: number,
		canceled_norm_inv: number,
		reply_norm_inv: number,
	): number;
}

export interface IMinMaxValues {
	age: Range;
	accepted: Range;
	canceled: Range;
	reply: Range;
	distance: Range;
}

export interface IGeolocation {
	latitude: number;
	longitude: number;
}
