import express from 'express';

import { IController } from './interfaces/controller/controller.interface'; //taking everything that is implemented inside the IController, which is the interface that is implemented in each controller class

class App {
	app: express.Application; //taking everything that is inside the application interface, methods etc (express, use, listen, etc) (dependency inversion) (open and closed), this app will be accessed when we instantiate the App class on the server

	//expect to receive an array with all the controller abstractions (instances)

	//when instantiating the class from outside with new app, it already runs the functions that are inside the constructor

	constructor(controllers: Array<IController>) {
		this.app = express();
		this.middlewares(); //initializing middlewares
		this.routes(); // initializing routes
		this.initializeControllers(controllers); // initializing controllers
	}

	// all of the middlewares that we want to use in our application

	middlewares(): void {
		this.app.use(express.json());
	}

	routes() {
		this.app.get('/ping', (_req, res) => {
			return res.status(200).send('pong');
		});

		// this.app.use(algumRouterAntigo);
	}

	// function that receives the controller array, and then it passes controller by controller, and running the router from within it (that route that we created), the ideal is to standardize all controllers for this.
	initializeControllers(controllers: Array<any>) {
		controllers.forEach((controller) => {
			this.app.use(controller.router);
		});
	}
}

export default App;
