export default interface IPatient {
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
}
