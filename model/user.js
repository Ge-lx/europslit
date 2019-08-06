const crypto = require('../crypto');
const _ = require('lodash');
const { knex } = require('../db');
const { USER_NOT_FOUND, INVALID_LOGIN, USERNAME_TAKEN } = require('../errorcodes');
const shortid = require('shortid');

const loginUser = async (username, password) => {

	const found_user = await knex('user')
		.where({ username });

	if (!found_user || found_user.length < 1) {
		throw USER_NOT_FOUND();
	}

	if (await crypto.compareHash(password, found_user[0].salt, found_user[0].hash) === false) {
		throw INVALID_LOGIN();
	}

	let user = _.pick(found_user[0], ['username', 'shortId']);
	let token = await crypto.createJWT(user);

	await knex('user')
		.where({ username })
		.update({ last_handshake: new Date() });

	return { token, user };
}

const registerUser = async (username, password) => {

	const other_user = await knex('user')
		.where({
			username: username
		});

	if (other_user && other_user.length > 0) {
		throw USERNAME_TAKEN();
	}

	const { hash, salt } = await crypto.hashPassword(password);
	const userId = shortid.generate();

	await knex('user')
		.insert({
			username: username,
			hash: hash,
			salt: salt,
			shortId: userId,
			created_at: new Date(),
			last_handshake: new Date()
		});

	let user = {
		username: username,
		shortId: userId
	};
	let token = await crypto.createJWT(user);

	return { token, user };
};


module.exports = {
	registerUser,
	loginUser
}