import { IResponseDetailsPatientsDebug, IResponsePatients } from '../../../model/patient.model';
import { IGeolocation } from '../utils/calculations.interface';

export interface IBetterListGeneratorService {
	processList(reference: IGeolocation, debug: boolean): IResponsePatients[] | IResponseDetailsPatientsDebug[];
	loadPatients(): void;
	selectPatients(): IResponsePatients[];
	selectPatientsDebug(): IResponseDetailsPatientsDebug[];
}
