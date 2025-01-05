import { IPatient, IResponsePatients } from '../model/patient.model';
import { IBetterListGeneratorService } from '../utils/interfaces/service/betterListGenerator.service.interface';
import * as fs from 'fs';
import * as path from 'path';
import { ICalculations, IGeolocation } from '../utils/interfaces/utils/calculations.interface';

class BetterListGeneratorService implements IBetterListGeneratorService {
	private patients: IPatient[] = [];
	constructor(private calculator: ICalculations) {}

	processList(reference: IGeolocation): IResponsePatients[] {
		// Load patients in memory
		this.loadPatients();

		// i need to pass through patients twice. One to find the min and max values for each field and another to calculate the score
		// Find min and max values for each field
		const minMaxValues = this.calculator.minMaxFinder(this.patients, reference);

		// Calculate the score for each patient using normalization and weight application
		this.patients.forEach((patient) => {
			this.calculator.patientScoreCalculator(patient, minMaxValues);
		});

		// Sort patients by score
		return this.selectPatients();
	}

	loadPatients(): void {
		try {
			const filePath = path.join(__dirname, '..', 'utils', 'mocks', 'patients.json');
			const data = fs.readFileSync(filePath, 'utf-8');
			this.patients = JSON.parse(data);
		} catch (error) {
			throw new Error(`Error loading patients: ${error}`);
		}
	}

	selectPatients(): IResponsePatients[] {
		// separate patients by behavior
		// select 8 best patients
		const topPatients = this.patients
			.filter((patient) => patient.score !== undefined && patient.behavior === true)
			.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
			.slice(0, 8)
			.map((patient) => ({
				id: patient.id,
				name: patient.name,
				score: patient.score!,
				behavior: patient.behavior === true ? 'good' : 'little',
			}));

		console.log(topPatients);

		// select 2 random patients with little behavior data
		const selectedRandomPatients = this.patients
			.filter((patient) => patient.behavior === false)
			.sort(() => Math.random() - 0.5) // mix the array
			.slice(0, 2)
			.map((patient) => ({
				id: patient.id,
				name: patient.name,
				score: patient.score!,
				behavior: patient.behavior === true ? 'good' : 'little',
			}));

		// put everything together
		const finalList = [...topPatients, ...selectedRandomPatients];

		return finalList;
	}
}

export default BetterListGeneratorService;
