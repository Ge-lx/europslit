const express = require('express');
const path = require('path');
const http = require('http');
const db = require('./db');
const router = require('./router');

const CONFIG = {
	env: process.env.NODE_ENV || 'development',
	version: '0.1DEV',
	root: __dirname,
	port: 8080,
	knex: {
		client: 'sqlite3',
		connection: {
			filename: "./database.sqlite"
		},
		useNullAsDefault: true
	},
	auth: {
		cookieName: 'auth_token',
		cookieOptions: {
			maxAge: 900000,
			httpOnly: true
		}
	}
};

(async () => {
	console.log(`Starting split v${CONFIG.version}`);

	var app = express();

	app.locals.ENV = CONFIG.env;
	app.locals.ENV_DEVELOPMENT = (CONFIG.env === 'development');
	app.locals.rootPath = process.env.ROOT_PATH;

	console.log(`Establishing DB connection...`);
	await db.init(CONFIG);
	console.log(`Loading componentes...`);
	router.init(app, CONFIG);

	console.log(`Starting server...`)
	await new Promise((resolve, reject) => {
		let server = http.createServer(app);
		server.listen(CONFIG.port);
		server.on('error', reject);
		server.on('listening', resolve);
	});

	console.log(`App started and running a ${CONFIG.env} server. Listening on ${CONFIG.port}`);
})()
	.catch(error => {
		if (error.syscall !== 'listen') {
			throw error
		}
		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
			console.error('Port ' + CONFIG.bind_port + ' requires elevated privileges');
			process.exit(1);
		case 'EADDRINUSE':
			console.error('Port ' + CONFIG.bind_port + ' is already in use');
			process.exit(1);
		default:
			throw error;
		}
	});