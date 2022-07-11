# Capstone: Restaurant Reservation System
An application built for restaurant employees to keep track of customer reservations. It allows employees to seat, search, and add reservations as well as tracking open tables and completing reservations.

## Technology

- Built using React.js, HTML, CSS, Bootstrap, ElephantSQL, PostgreSQL,JSX, Expressjs, Node.js, and Heroku.

- To install this application:

	- Fork and Clone this repository.
	- Run cp ./back-end/.env.sample ./back-end/.env.
	- Update the ./back-end/.env file with the connection URL's to your ElephantSQL database instance.
	- Run cp ./front-end/.env.sample ./front-end/.env.
	- You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than http://localhost:5001
	- Run npm i to install project dependencies.
	- Run npm run start:dev to start your server in development mode
	- Tests for this application can be run for each User Story by running 
      - `npm run test:X` 
      - `npm run test:X:frontend` 
      - `npm run test:X:backend`
