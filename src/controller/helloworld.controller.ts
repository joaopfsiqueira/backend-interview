import { Request, Response, Router } from 'express';
import { Http } from '../utils/enum/http.enum';
import { IController } from '../interfaces/controller/controller.interface';

// import { IHelloWorldService } from 'helloworld.service.ts'

class HelloWorldController implements IController {
	public router: Router;
	private readonly basePath = '/';
	// private service: IHelloWorldService;
	//constructor(service: IHelloWorldService)

	constructor() {
		this.router = Router();
		this.initializeRouter();
		// this.service = service; Here I would assign the service that I would import above to the class attribute, to have context within it and use it with this.service, it is the abstraction of the class, which provides access to its public methods.
	}

	private initializeRouter(): void {
		this.router.get(`${this.basePath}`, this.helloWorld.bind(this));
		//making a binding to the function that will be called when the request is received.
	}

	private async helloWorld(_req: Request, res: Response): Promise<Response | Error> {
		try {
			return res.status(Http.OK).send('hello world!');
		} catch (error) {
			// validating if error is an instance of Error, to do the ternary below and be able to access the error properties, such as error.message! This is one of the annoyances of this typescript, it is a way of making the error type explicit, to avoid typing errors. In normal javascript it would not be necessary to do this, just needing to do a res.status(Http.INTERNAL_SERVER_ERROR).send(error.message).

			const isError = error instanceof Error;

			return isError
				? res.status(Http.INTERNAL_SERVER_ERROR).send(error.message)
				: res.status(Http.INTERNAL_SERVER_ERROR).send(String(error));
		}
	}
}

export default HelloWorldController;
