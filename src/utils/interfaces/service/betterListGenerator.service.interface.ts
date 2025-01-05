import { IGeolocation } from '../utils/calculations.interface';

export interface IBetterListGeneratorService {
	processList(reference: IGeolocation, debug: boolean): IResponsePatients[] | IResponseDetailsPatientsDebug[];
	loadPatients(): void;
	selectPatients(): IResponsePatients[];
	selectPatientsDebug(): IResponseDetailsPatientsDebug[];
}

export interface IResponsePatients {
	id: string;
	name: string;
	score: number;
	behavior: string;
}

export interface IResponseDetailsPatientsDebug {
	id: string;
	name: string;
	distance: number;
	age: number;
	acceptedOffers: number;
	canceledOffers: number;
	averageReplyTime: number;
	score: {
		age: number;
		accepted: number;
		canceled: number;
		reply: number;
		distance: number;
		total: number;
	};
	behaviorScore?: number;
	behavior?: string;
}
