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
	distance?: number;
	score?: number;
	totalOffers?: number;
	behavior?: boolean; // little = false, much = true
}

export interface IResponsePatients {
	id: string;
	name: string;
	score: number;
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
}
