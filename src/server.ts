import 'dotenv/config';
import App from './app';
import BetterListGeneratorController from './controller/betterListGenerator.controller';
import BetterListGeneratorService from './service/betterListGenerator.service';
import Calculations from './utils/calculator/calculations';

/* Main Function, responsible for gathering ALL abstractions (instances) and using them in your services that expect to receive an instance of an abstract class.

Or, simply run a database connection, execute a function, etc.

*/

export async function server(): Promise<void> {
	/**ß

* initializing Services / Functions

*/
	const calculators = new Calculations();
	const service = new BetterListGeneratorService(calculators);

	/**

* initializing Controllers

*/

	const gerenatorController = new BetterListGeneratorController(service);

	/**

* initializing server, server will receive the controllers that will be used in the routes

*/

	const app = new App([gerenatorController]).app; //acessando a propriedade publica da app que contem o express()

	const port = process.env.PORT || 3333;
	app.listen(port, () => {
		console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
	});
}

server();
