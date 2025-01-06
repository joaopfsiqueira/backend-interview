import { IPatient } from '../model/patient.model';
import {
	IBetterListGeneratorService,
	IResponseDetailsPatientsDebug,
	IResponsePatients,
} from '../utils/interfaces/service/betterListGenerator.service.interface';
import * as fs from 'fs';
import * as path from 'path';
import { ICalculations, IGeolocation } from '../utils/interfaces/utils/calculations.interface';

class BetterListGeneratorService implements IBetterListGeneratorService {
	private patients: IPatient[] = [];
	constructor(private calculator: ICalculations) {}

	processList(reference: IGeolocation, debug: boolean): IResponsePatients[] | IResponseDetailsPatientsDebug[] {
		try {
			// Load patients in memory
			this.loadPatients();

			if (this.patients.length === 0) {
				throw new Error('No patients found');
			}

			// i need to pass through patients twice. One to find the min and max values for each field and another to calculate the score
			// Find min and max values for each field
			const minMaxValues = this.calculator.minMaxFinder(this.patients, reference);

			// Calculate the score for each patient using normalization and weight application
			this.patients.forEach((patient) => {
				this.calculator.patientScoreCalculator(patient, minMaxValues);
			});

			// Sort patients by score
			return debug === false ? this.selectPatients() : this.selectPatientsDebug();
		} catch (error) {
			throw new Error(`Error processing list: ${error}`);
		}
	}

	loadPatients(): void {
		try {
			const filePath =
				process.env.NODE_ENV == 'production'
					? path.join(__dirname, '..', 'public', 'mocks', 'patients.json')
					: path.join(__dirname, '..', '..', 'public', 'mocks', 'patients.json');
			const data = fs.readFileSync(filePath, 'utf-8');
			this.patients = JSON.parse(data);
		} catch (error) {
			throw new Error(`Error loading patients: ${error}`);
		}
	}

	selectPatients(): IResponsePatients[] {
		try {
			// separate patients by behavior
			// select 8 best patients
			const topPatients = this.patients
				.filter((patient) => patient.score !== undefined && patient.behavior === true)
				.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
				.slice(0, process.env.TOTAL_TOP_PATIENTS)
				.map((patient) => ({
					id: patient.id,
					name: patient.name,
					score: patient.score!,
					behavior: patient.behavior === true ? 'good' : 'little',
				}));

			// select 2 random patients with little behavior data
			const selectedRandomPatients = this.patients
				.filter((patient) => patient.behavior === false)
				.sort(() => Math.random() - 0.5) // mix the array
				.slice(0, process.env.TOTAL_RANDOM_PATIENTS)
				.map((patient) => ({
					id: patient.id,
					name: patient.name,
					score: patient.score!,
					behavior: patient.behavior === true ? 'good' : 'little',
				}));

			// put everything together
			const finalList = [...topPatients, ...selectedRandomPatients];

			return finalList;
		} catch (error) {
			throw new Error(`Error selecting patients: ${error}`);
		}
	}

	selectPatientsDebug(): IResponseDetailsPatientsDebug[] {
		try {
			// separate patients by behavior
			// select 8 best patients
			const topPatients = this.patients
				.filter((patient) => patient.score !== undefined && patient.behavior === true)
				.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
				.slice(0, 8)
				.map((patient) => ({
					id: patient.id,
					name: patient.name,
					distance: patient.distance!,
					age: patient.age,
					acceptedOffers: patient.acceptedOffers,
					canceledOffers: patient.canceledOffers,
					averageReplyTime: patient.averageReplyTime,
					score: {
						age: patient.score!,
						accepted: patient.acceptedOffers,
						canceled: patient.canceledOffers,
						reply: patient.averageReplyTime,
						distance: patient.distance!,
						total: patient.score!,
					},
					behaviorScore: patient.behaviorScore!,
					behavior: patient.behavior === true ? 'good' : 'little',
				}));

			// select 2 random patients with little behavior data
			const selectedRandomPatients = this.patients
				.filter((patient) => patient.behavior === false)
				.sort(() => Math.random() - 0.5) // mix the array
				.slice(0, 2)
				.map((patient) => ({
					id: patient.id,
					name: patient.name,
					distance: patient.distance!,
					age: patient.age,
					acceptedOffers: patient.acceptedOffers,
					canceledOffers: patient.canceledOffers,
					averageReplyTime: patient.averageReplyTime,
					score: {
						age: patient.score!,
						accepted: patient.acceptedOffers,
						canceled: patient.canceledOffers,
						reply: patient.averageReplyTime,
						distance: patient.distance!,
						total: patient.score!,
					},
					behaviorScore: patient.behaviorScore!,
					behavior: patient.behavior === true ? 'good' : 'little',
				}));

			// put everything together
			const finalList = [...topPatients, ...selectedRandomPatients];

			return finalList;
		} catch (error) {
			throw new Error(`Error selecting patients debug: ${error}`);
		}
	}
}

export default BetterListGeneratorService;
