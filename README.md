# Luma Technical Interview

### Summary

-    [About](#about)
-    [Requirements](#requirements)
-    [Stack used](#stack)
-    [Model and Responses](#model)
     -    [Environment](#environment)
-    [Running](#running)
     -    [Running Locally](#runninglocally)
     -    [Running with Docker](#runningdocker)
     -    [Unit Test](#unit)

<a id="about"></a>

## 📜 About:

The api has an algorithm that calculates an acceptance score (1 to 10) for patients based on demographic and behavioral data, estimating the likelihood that they will accept an appointment offer. Patients with low behavioral data are randomly assigned to the top of the list, ensuring fairness. The API allows filtering by facility location and returns the 10 patients most likely to accept the offer, optimizing resources and improving efficiency in the scheduling process.

<a id="requirements"></a>

## Requirements

Ensure you have the following installed:

-    **Node.js**: Version 20.14.0 or higher
-    **npm**: Version 10.7.0 or higher
-    **Docker**: Version 27.2.0 or compatible
-    **Docker Compose** version v2.29.2 for desktop!

<a id="stack"></a>

## 🔧 Stack Utilizada:

-    [NodeJS](https://nodejs.org/)
-    [Express](https://expressjs.com/)
-    [Vitest](https://www.npmjs.com/package/vitest)
-    [Nodemon](https://nodemon.io/)
-    [Zod](https://zod.dev/)

<a id="model"></a>

## Model and Responses

Patient Model:
**Ex:**

```Typescript
{
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
	behaviorScore?: number;
}
```

Responses:
**Ex: Short and Debug**

```Typescript
{
     id: string;
	name: string;
	score: number;
	behavior: string;
}
```

If you call the route `http://localhost:3333/api/v1/list-generator/debug?latitude=00.0000&longitude=00.0000`

```Typescript
{
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
```

<a id="environment"></a>

### Environment:

_I separated production and development! If you want to test the code after building the javascript, you will use .env.prod along with the npm run start script! If you run the application through docker, it will always run in production!_

Before running the code, you need to fill in two files: .env and .env.prod

Here is the template
**Ex:**

```.env
NODE_ENV=development
PORT=3333
TOTAL_TOP_PATIENTS=7
TOTAL_RANDOM_PATIENTS=3
```

```.prod
NODE_ENV=production
PORT=3333
TOTAL_TOP_PATIENTS=7
TOTAL_RANDOM_PATIENTS=3
```

If you want to have more than 3 random patients, just change the value!

_Remember that the sum of TOTAL_TOP_PATIENTS and TOTAL_RANDOM_PATIENTS **MUST** be 10 (To return the 10 patients)._
<a id="running"></a>

## 🏎 Running

You can choose between running locally or running through a docker container!

<a id="runninglocally"></a>

### Running locally

At the root of the project

1. run `npm i`
2. run `npm run dev` - development environment, using nodemon!
3. run `npm start` - transpile to javascript and run in production environment! (Different \_\_dirpath)

<a id="runningdocker"></a>

### Running in a Docker container

At the root of the project

1. using _docker compose_ `docker compose up -d`

without _docker compose_

1. run `docker build . -t backend-interview`
2. run `docker run -d --name backend-interview -p 3333:3333 backend-interview:latest`

<a id="testyourself"></a>

## Test by yourself!

The API has three http routes. Remember to swap the latitude and longitude values!!

-    GET `ping` - will receive pong
-    GET `/api/v1/list-generator?latitude=00.0000&-longitude=00.0000` will receive the cleanest object
-    GET `/api/v1/list-generator/debug?latitude=00.0000&longitude=00.0000` will receive information to validate the calculation.

I like to use platforms that allow making http requests like postman or insomnia! In my tests I used **postman**! I even left a json file of the postman collection in the root of the project to import and save time, if you want!

However, you can also call the route in your browser, putting the url as: http://localhost:3333/api/v1/list-generator?latitude=68.8120&longitude=71.3018

Or, using terminal curl request! Here's an example!

```shell
curl --location 'http://localhost:3333/api/v1/list-generator/debug?latitude=68.8120&longitude=71.3018'
```

<a id="unit"></a>

### Unit Test

To run unit test is simple!

At the root of the project

1. run `npm i`
2. run `npm run test:coverage` - run tests with coverage
3. run `npm run test` - run tests without coverage
