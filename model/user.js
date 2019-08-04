const crypto = require('../crypto');
const { knex } = require('../db');

const addUser = async (username, password) => {

	const other_user = await _knex('user')
		.where({
			username: username
		});

	if (other_user && other_user.length > 0) {
		throw 'Username already taken.';
	}

	const { hash, salt } = await crypto.hashPassword(password);

	await _knex('user')
		.insert({
			username: username,
			hash: hash,
			salt: salt
		});

	return { token: 'bla', user: {
		username: username
	}};
};


module.exports = {
	addUser
}