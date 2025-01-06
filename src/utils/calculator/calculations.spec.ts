import { expect, describe, it, beforeEach } from 'vitest';
import Calculations from './calculations';
import { IGeolocation, IMinMaxValues } from '../interfaces/utils/calculations.interface';
import { IPatient } from '../../model/patient.model';

describe('Calculator', () => {
	let calculations: Calculations;

	beforeEach(() => {
		calculations = new Calculations();
	});

	describe('minMaxFinder', () => {
		it('must calculate the minimum and maximum values ​​correctly with haversine ', () => {
			const patients: IPatient[] = [
				{
					id: '541d25c9-9500-4265-8967-240f44ecf723',
					name: 'Samir Pacocha',
					location: {
						latitude: '46.7110',
						longitude: '-63.1150',
					},
					age: 46,
					acceptedOffers: 49,
					canceledOffers: 92,
					averageReplyTime: 2598,
				},
				{
					id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
					name: 'Bernard Mosciski',
					location: {
						latitude: '-81.0341',
						longitude: '144.9963',
					},
					age: 21,
					acceptedOffers: 95,
					canceledOffers: 96,
					averageReplyTime: 1908,
				},
				{
					id: '90592106-a0d9-4329-8159-af7ce4ba45ad',
					name: 'Theo Effertz',
					location: {
						latitude: '-35.5336',
						longitude: '-25.2795',
					},
					age: 67,
					acceptedOffers: 69,
					canceledOffers: 24,
					averageReplyTime: 3452,
				},
			];

			const reference: IGeolocation = { latitude: 12.9716, longitude: 77.5946 };

			const result: IMinMaxValues = calculations.minMaxFinder(patients, reference);

			expect(result.age.min).toBe(21);
			expect(result.age.max).toBe(67);

			expect(result.accepted.min).toBe(49);
			expect(result.accepted.max).toBe(95);

			expect(result.canceled.min).toBe(24);
			expect(result.canceled.max).toBe(96);

			expect(result.totalOffers.min).toBe(93);
			expect(result.totalOffers.max).toBe(191);

			expect(result.reply.min).toBe(1908);
			expect(result.reply.max).toBe(3452);

			expect(result.distance.min).toBeGreaterThan(0);
			expect(result.distance.max).toBeGreaterThan(0);
		});

		it('should throw an error for an invalid unit', () => {
			expect(() => {
				calculations.haversineMethod(12.9716, 77.5946, 13.0827, 80.2707, 'invalid' as any);
			}).toThrowError("Invalid unit. Use 'km' for kilometers or 'mi' for miles.");
		});

		it('should throw an error if patient distance is not defined', () => {
			const patient: IPatient = {
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				location: { latitude: '0', longitude: '0' },
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 92,
				averageReplyTime: 2598,
			};

			const minMaxValues: IMinMaxValues = {
				age: { min: 20, max: 50 },
				accepted: { min: 1, max: 10 },
				canceled: { min: 0, max: 5 },
				totalOffers: { min: 1, max: 20 },
				reply: { min: 5, max: 15 },
				distance: { min: 0, max: 100 },
			};

			expect(() => {
				calculations.patientScoreCalculator(patient, minMaxValues);
			}).toThrowError('Distance is not defined');
		});

		it('must correctly calculate the patients score', () => {
			const patient: IPatient = {
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				location: {
					latitude: '46.7110',
					longitude: '-63.1150',
				},
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 92,
				distance: 10,
				averageReplyTime: 2598,
			};

			const minMaxValues: IMinMaxValues = {
				age: { min: 20, max: 99 },
				accepted: { min: 50, max: 100 },
				canceled: { min: 30, max: 100 },
				totalOffers: { min: 50, max: 100 },
				reply: { min: 2000, max: 3000 },
				distance: { min: 300, max: 1000 },
			};

			calculations.patientScoreCalculator(patient, minMaxValues);

			expect(patient.score).toBeGreaterThanOrEqual(1);
			expect(patient.score).toBeLessThanOrEqual(10);
		});

		it('must ensure that the score is never less than 1', () => {
			const patient: IPatient = {
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				location: {
					latitude: '46.7110',
					longitude: '-63.1150',
				},
				age: 70,
				acceptedOffers: 1,
				canceledOffers: 92,
				averageReplyTime: 2598,
				distance: 10,
			};

			const minMaxValues: IMinMaxValues = {
				age: { min: 20, max: 99 },
				accepted: { min: 50, max: 100 },
				canceled: { min: 30, max: 100 },
				totalOffers: { min: 50, max: 100 },
				reply: { min: 2000, max: 3000 },
				distance: { min: 300, max: 1000 },
			};

			calculations.patientScoreCalculator(patient, minMaxValues);

			expect(patient.score).toBe(1);
		});

		it('must correctly calculate the patients behavior', () => {
			const patient: IPatient = {
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				location: {
					latitude: '46.7110',
					longitude: '-63.1150',
				},
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 92,
				averageReplyTime: 2598,
				distance: 10,
			};

			const minMaxValues: IMinMaxValues = {
				age: { min: 20, max: 50 },
				accepted: { min: 1, max: 10 },
				canceled: { min: 0, max: 5 },
				totalOffers: { min: 1, max: 20 },
				reply: { min: 5, max: 15 },
				distance: { min: 0, max: 100 },
			};

			calculations.patientScoreCalculator(patient, minMaxValues);

			expect(patient.behavior).toBe(true);
		});

		it('must find a patient with little behavior and set as false', () => {
			const patients: IPatient = {
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				location: {
					latitude: '46.7110',
					longitude: '-63.1150',
				},
				age: 46,
				acceptedOffers: 0,
				canceledOffers: 0,
				totalOffers: 2,
				averageReplyTime: 2598,
				distance: 10,
			};

			const minMaxValues: IMinMaxValues = {
				age: { min: 20, max: 50 },
				accepted: { min: 1, max: 96 },
				canceled: { min: 0, max: 94 },
				totalOffers: { min: 1, max: 180 },
				reply: { min: 5, max: 15 },
				distance: { min: 0, max: 100 },
			};

			calculations.littleBehaviorCalculator(patients, minMaxValues.totalOffers);

			expect(patients.behavior).toBe(false);
		});
	});
});
