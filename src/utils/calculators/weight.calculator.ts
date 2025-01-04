import { Weights } from '../enum/weight.enum';

export function WeightApplication(
	age_norm: number,
	distance_norm: number,
	accepted_norm: number,
	canceled_norm_inv: number,
	reply_norm_inv: number,
): number {
	return (
		age_norm * Weights.AGE +
		distance_norm * Weights.DISTANCE +
		accepted_norm * Weights.ACCEPTED_OFFERS +
		canceled_norm_inv * Weights.CANCELED_OFFERS +
		reply_norm_inv * Weights.REPLY_TIME
	);
}
