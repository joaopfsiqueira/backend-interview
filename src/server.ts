import 'dotenv/config';
import HelloWorldController from './controller/helloworld.controller';
import App from './app';

/* Main Function, responsible for gathering ALL abstractions (instances) and using them in your services that expect to receive an instance of an abstract class.

Or, simply run a database connection, execute a function, etc.

*/

export async function server(): Promise<void> {
	/**

* Instance of Connections

*/

	/**

* Up connections

*/

	/**

* initializing Services

*/

	/**

* initializing Controllers

*/

	const controllers = new HelloWorldController();

	/**

* initializing server, server will receive the controllers that will be used in the routes

*/

	const app = new App([controllers]).app; //acessando a propriedade publica da app que contem o express()

	app.listen(process.env.PORT, () => {
		console.log(`Server is running on port ${process.env.PORT}`);
	});
}

server();
