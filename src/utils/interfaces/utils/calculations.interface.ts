import { IPatient } from '../../../model/patient.model';
import { TUnit, TRange } from '../../../utils/types/types';

export interface ICalculations {
	minMaxFinder(patients: IPatient[], reference: IGeolocation): IMinMaxValues;
	haversineMethod(lat1: number, lon1: number, lat2: number, lon2: number, unit?: TUnit): number;
	patientScoreCalculator(patient: IPatient, minMaxValues: IMinMaxValues): void;
	minMaxNormalization(value: number, range: TRange): number;
	minMaxNormalizationTheSmallerTheBetter(value: number, range: TRange): number;
	weightApplication(
		age_norm: number,
		distance_norm: number,
		accepted_norm: number,
		canceled_norm_inv: number,
		reply_norm_inv: number,
	): number;
	littleBehaviorCalculator(patient: IPatient, range: TRange): void;
}

export interface IMinMaxValues {
	age: TRange;
	accepted: TRange;
	canceled: TRange;
	totalOffers: TRange;
	reply: TRange;
	distance: TRange;
}

export interface IGeolocation {
	latitude: number;
	longitude: number;
}
