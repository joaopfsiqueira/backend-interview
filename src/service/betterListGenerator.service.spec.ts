import 'dotenv/config';

import { describe, vi, beforeEach, afterEach, it, expect } from 'vitest';

import BetterListGeneratorService from './betterListGenerator.service';
import { ICalculations, IGeolocation } from '../utils/interfaces/utils/calculations.interface';
import { IPatient } from '../model/patient.model';

import * as fs from 'fs';

// Mock modules
vi.mock('fs');
vi.mock('path');

describe('BetterListGeneratorService', () => {
	let service: BetterListGeneratorService;
	let mockCalculator: ICalculations;
	let mockReference: IGeolocation;

	beforeEach(() => {
		mockCalculator = {
			minMaxFinder: vi.fn().mockReturnValue({
				age: { min: 21, max: 67 },
				accepted: { min: 49, max: 95 },
				distance: { min: 0, max: 100 },
				canceled: { min: 24, max: 96 },
				reply: { min: 1908, max: 3452 },
			}),
			patientScoreCalculator: vi.fn(),
		} as unknown as ICalculations;

		service = new BetterListGeneratorService(mockCalculator);

		mockReference = {
			latitude: 0,
			longitude: 0,
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should load patients successfully', () => {
		vi.mocked(fs.readFileSync).mockReturnValue(
			JSON.stringify([
				{
					id: '541d25c9-9500-4265-8967-240f44ecf723',
					name: 'Samir Pacocha',
					location: { latitude: '46.7110', longitude: '-63.1150' },
					age: 46,
					acceptedOffers: 49,
					canceledOffers: 92,
					averageReplyTime: 2598,
				},
				{
					id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
					name: 'Bernard Mosciski',
					location: { latitude: '-81.0341', longitude: '144.9963' },
					age: 21,
					acceptedOffers: 95,
					canceledOffers: 96,
					averageReplyTime: 1908,
				},
			]),
		);

		service.loadPatients();

		expect(service['patients']).toHaveLength(2);
		expect(fs.readFileSync).toHaveBeenCalledTimes(1);
	});

	it('should load patients successfully in production', () => {
		vi.mocked(fs.readFileSync).mockReturnValue(
			JSON.stringify([
				{
					id: '541d25c9-9500-4265-8967-240f44ecf723',
					name: 'Samir Pacocha',
					location: { latitude: '46.7110', longitude: '-63.1150' },
					age: 46,
					acceptedOffers: 49,
					canceledOffers: 92,
					averageReplyTime: 2598,
				},
				{
					id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
					name: 'Bernard Mosciski',
					location: { latitude: '-81.0341', longitude: '144.9963' },
					age: 21,
					acceptedOffers: 95,
					canceledOffers: 96,
					averageReplyTime: 1908,
				},
			]),
		);

		process.env.NODE_ENV = 'production';

		service.loadPatients();

		expect(service['patients']).toHaveLength(2);
		expect(fs.readFileSync).toHaveBeenCalledTimes(1);
	});

	it('should throw an error when patients file fails to load', () => {
		vi.mocked(fs.readFileSync).mockImplementation(() => {
			throw new Error('File not found');
		});

		expect(() => service.loadPatients()).toThrow('Error loading patients: Error: File not found');
	});

	it('should process the list and return patients with debug', () => {
		vi.mocked(fs.readFileSync).mockReturnValue(
			JSON.stringify([
				{
					id: '541d25c9-9500-4265-8967-240f44ecf723',
					name: 'Samir Pacocha',
					location: { latitude: '46.7110', longitude: '-63.1150' },
					age: 46,
					acceptedOffers: 49,
					canceledOffers: 92,
					averageReplyTime: 2598,
					behavior: true,
					score: 85,
				},
				{
					id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
					name: 'Bernard Mosciski',
					location: { latitude: '-81.0341', longitude: '144.9963' },
					age: 21,
					acceptedOffers: 95,
					canceledOffers: 96,
					averageReplyTime: 1908,
					behavior: false,
					score: 72,
				},
			]),
		);

		process.env.TOTAL_TOP_PATIENTS = 2;
		process.env.TOTAL_RANDOM_PATIENTS = 1;

		const result = service.processList(mockReference, true);

		expect(result).toHaveLength(2);
		expect(mockCalculator.minMaxFinder).toHaveBeenCalled();
		expect(mockCalculator.patientScoreCalculator).toHaveBeenCalledTimes(2);
	});

	it('should process the list and return patients', () => {
		vi.mocked(fs.readFileSync).mockReturnValue(
			JSON.stringify([
				{
					id: '541d25c9-9500-4265-8967-240f44ecf723',
					name: 'Samir Pacocha',
					location: { latitude: '46.7110', longitude: '-63.1150' },
					age: 46,
					acceptedOffers: 49,
					canceledOffers: 92,
					averageReplyTime: 2598,
					behavior: true,
					score: 85,
				},
				{
					id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
					name: 'Bernard Mosciski',
					location: { latitude: '-81.0341', longitude: '144.9963' },
					age: 21,
					acceptedOffers: 95,
					canceledOffers: 96,
					averageReplyTime: 1908,
					behavior: false,
					score: 72,
				},
			]),
		);

		process.env.TOTAL_TOP_PATIENTS = 2;
		process.env.TOTAL_RANDOM_PATIENTS = 1;

		const result = service.processList(mockReference, false);

		expect(result).toHaveLength(2);
		expect(mockCalculator.minMaxFinder).toHaveBeenCalled();
		expect(mockCalculator.patientScoreCalculator).toHaveBeenCalledTimes(2);
	});

	it('should throw an error if no patients are found', () => {
		vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([]));

		expect(() => service.processList(mockReference, false)).toThrow('No patients found');
	});

	it('should select top and random patients', () => {
		service['patients'] = [
			{
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				score: 85,
				behavior: true,
			},
			{
				id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
				name: 'Bernard Mosciski',
				score: 72,
				behavior: false,
			},
		] as IPatient[];
		process.env.TOTAL_TOP_PATIENTS = 1;
		process.env.TOTAL_RANDOM_PATIENTS = 1;

		const result = service.selectPatients();

		expect(result).toHaveLength(2);
		expect(result[0]!.behavior).toBe('good');
		expect(result[1]!.behavior).toBe('little');
	});

	it('should select top but no random patients and add more top patients', () => {
		service['patients'] = [
			{
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				score: 85,
				behavior: true,
			},
			{
				id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
				name: 'Bernard Mosciski',
				score: 72,
				behavior: true,
			},
			{
				id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
				name: 'Bernard Mosciski',
				score: 70,
				behavior: true,
			},
		] as IPatient[];
		process.env.TOTAL_TOP_PATIENTS = 2;
		process.env.TOTAL_RANDOM_PATIENTS = 1;

		const result = service.selectPatients();

		expect(result).toHaveLength(3);
	});

	it('should select top and random patients with debug return', () => {
		service['patients'] = [
			{
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				distance: 46,
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 92,
				averageReplyTime: 2598,
				score: 85,
				behaviorScore: 85,
				behavior: true,
			},
			{
				id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
				name: 'Bernard Mosciski',
				distance: 46,
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 100,
				averageReplyTime: 200,
				score: 90,
				behaviorScore: 85,
				behavior: false,
			},
		] as IPatient[];
		process.env.TOTAL_TOP_PATIENTS = 1;
		process.env.TOTAL_RANDOM_PATIENTS = 1;

		const result = service.selectPatientsDebug();

		expect(result).toHaveLength(2);
		expect(result.some((patient) => patient.score.age)).toBe(true);
		expect(result.some((patient) => patient.score.accepted)).toBe(true);
		expect(result.some((patient) => patient.score.canceled)).toBe(true);
		expect(result.some((patient) => patient.score.reply)).toBe(true);
		expect(result.some((patient) => patient.score.distance)).toBe(true);
		expect(result[0]!.behavior).toBe('good');
		expect(result[1]!.behavior).toBe('little');
	});

	it('should select top and random patients with debug return and add more patients', () => {
		service['patients'] = [
			{
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				distance: 46,
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 92,
				averageReplyTime: 2598,
				score: 84,
				behaviorScore: 85,
				behavior: true,
			},
			{
				id: '541d25c9-9500-4265-8967-240f44ecf723',
				name: 'Samir Pacocha',
				distance: 46,
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 92,
				averageReplyTime: 2598,
				score: 85,
				behaviorScore: 85,
				behavior: true,
			},
			{
				id: '41fd45bc-b166-444a-a69e-9d527b4aee48',
				name: 'Bernard Mosciski',
				distance: 46,
				age: 46,
				acceptedOffers: 49,
				canceledOffers: 100,
				averageReplyTime: 200,
				score: 90,
				behaviorScore: 85,
				behavior: true,
			},
		] as IPatient[];
		process.env.TOTAL_TOP_PATIENTS = 2;
		process.env.TOTAL_RANDOM_PATIENTS = 1;

		const result = service.selectPatientsDebug();

		expect(result).toHaveLength(3);
	});
});
