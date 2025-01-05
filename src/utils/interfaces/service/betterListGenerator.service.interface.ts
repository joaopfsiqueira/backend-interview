import { IResponsePatients } from '../../../model/patient.model';
import { IGeolocation } from '../utils/calculations.interface';

export interface IBetterListGeneratorService {
	processList(reference: IGeolocation): IResponsePatients[];
	loadPatients(): void;
}
