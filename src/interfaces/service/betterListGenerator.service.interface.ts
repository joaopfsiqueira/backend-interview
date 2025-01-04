import IPatient from '../../model/patient.model';
import { IGeolocation } from '../utils/calculations.interface';

export interface IBetterListGeneratorService {
	processList(reference: IGeolocation): IPatient[];
	loadPatients(): void;
}
