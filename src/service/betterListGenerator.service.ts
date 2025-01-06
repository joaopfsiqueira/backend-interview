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
		let finalList: IResponsePatients[] = [];
		// separate patients by behavior
		// select 7 best patients
		const topPatients = this.patients
			.filter((patient) => patient.score !== undefined && patient.behavior === true)
			.sort((a, b) => b.score! - a.score!)
			.slice(0, process.env.TOTAL_TOP_PATIENTS)
			.map((patient) => ({
				id: patient.id,
				name: patient.name,
				score: patient.score!,
				behavior: 'good',
			}));

		// select 3 random patients with little behavior data
		const selectedRandomPatients = this.patients
			.filter((patient) => patient.behavior === false)
			.sort(() => Math.random() - 0.5) // mix the array
			.slice(0, process.env.TOTAL_RANDOM_PATIENTS)
			.map((patient) => ({
				id: patient.id,
				name: patient.name,
				score: patient.score!,
				behavior: 'little',
			}));

		if (selectedRandomPatients.length === 0) {
			const moreTopPatients = this.patients
				.filter((patient) => patient.score !== undefined && patient.behavior === true)
				.sort((a, b) => b.score! - a.score!)
				.slice(0, process.env.TOTAL_RANDOM_PATIENTS)
				.map((patient) => ({
					id: patient.id,
					name: patient.name,
					score: patient.score!,
					behavior: 'good',
				}));
			finalList = [...topPatients, ...moreTopPatients];
			return finalList;
		}

		// put everything together
		finalList = [...topPatients, ...selectedRandomPatients];

		return finalList;
	}

	selectPatientsDebug(): IResponseDetailsPatientsDebug[] {
		let finalList: IResponseDetailsPatientsDebug[] = [];
		// separate patients by behavior
		// select 8 best patients
		const topPatients = this.patients
			.filter((patient) => patient.score !== undefined && patient.behavior === true)
			.sort((a, b) => b.score! - a.score!)
			.slice(0, process.env.TOTAL_TOP_PATIENTS)
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
				behavior: 'good',
			}));

		// select 2 random patients with little behavior data
		const selectedRandomPatients = this.patients
			.filter((patient) => patient.behavior === false)
			.sort(() => Math.random() - 0.5) // mix the array
			.slice(0, process.env.TOTAL_RANDOM_PATIENTS)
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
				behavior: 'little',
			}));

		if (selectedRandomPatients.length === 0) {
			const moreTopPatients = this.patients
				.filter((patient) => patient.score !== undefined && patient.behavior === true)
				.sort((a, b) => b.score! - a.score!)
				.slice(0, process.env.TOTAL_RANDOM_PATIENTS)
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
					behavior: 'little',
				}));
			finalList = [...topPatients, ...moreTopPatients];
			return finalList;
		}

		// put everything together
		finalList = [...topPatients, ...selectedRandomPatients];

		return finalList;
	}
}

export default BetterListGeneratorService;
