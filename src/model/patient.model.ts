export interface IPatient {
	id: string;
	name: string;
	location: {
		latitude: string;
		longitude: string;
	};
	age: number;
	acceptedOffers: number;
	canceledOffers: number;
	averageReplyTime: number;
}

class PatientModel {
	constructor(public patient: IPatient) {}

	getPatient(): IPatient {
		return this.patient;
	}
}

export default PatientModel;
