import { Request, Response, Router } from 'express';
import { Http } from '../utils/enum/http.enum';
import { IController } from '../utils/interfaces/controller/controller.interface';
import { ErrorZodFormat } from '../utils/zod/zod.error';
import { GeolocationSchema } from '../utils/zod/geolocation.zod';
import { IBetterListGeneratorService } from '../utils/interfaces/service/betterListGenerator.service.interface';

class BetterListGeneratorController implements IController {
	public router: Router;
	private readonly basePath = '/list-generator';

	constructor(private service: IBetterListGeneratorService) {
		this.router = Router();
		this.initializeRouter();
		this.service = service;
	}

	private initializeRouter(): void {
		this.router.post(`${this.basePath}`, this.orderingPatients.bind(this));
		this.router.post(`${this.basePath}/debug`, this.orderingPatientsDebug.bind(this));
	}

	private async orderingPatients(_req: Request, res: Response): Promise<Response | Error> {
		try {
			const validation = await GeolocationSchema.safeParseAsync(_req.body);
			if (!validation.success) {
				const error = ErrorZodFormat(validation.error.errors);
				return res.status(Http.BAD_REQUEST).send(error);
			}

			const list = this.service.processList(validation.data, false);

			return res.status(Http.OK).send(list);
		} catch (error) {
			const isError = error instanceof Error;

			return isError
				? res.status(Http.INTERNAL_SERVER_ERROR).send(error.message)
				: res.status(Http.INTERNAL_SERVER_ERROR).send(String(error));
		}
	}

	private async orderingPatientsDebug(_req: Request, res: Response): Promise<Response | Error> {
		try {
			const validation = await GeolocationSchema.safeParseAsync(_req.body);
			if (!validation.success) {
				const error = ErrorZodFormat(validation.error.errors);
				return res.status(Http.BAD_REQUEST).send(error);
			}

			const list = this.service.processList(validation.data, true);

			return res.status(Http.OK).send(list);
		} catch (error) {
			const isError = error instanceof Error;

			return isError
				? res.status(Http.INTERNAL_SERVER_ERROR).send(error.message)
				: res.status(Http.INTERNAL_SERVER_ERROR).send(String(error));
		}
	}
}

export default BetterListGeneratorController;
