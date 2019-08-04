const crypto = require('crypto');
const { CONFIG } = require('./main');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

async function hashPassword (password) {
	const salt = await Promise.fromCallback(cb => crypto.randomBytes(256, cb));
	const hashBuffer = await Promise.fromCallback(cb => crypto.pbkdf2(password, salt, 100000, 64, 'sha512', cb));

	return {
		hash: hashBuffer.toString('hex'),
		salt
	};
};

async function compareHash (password, salt, hash) {
	const hashBuffer = await Promise.fromCallback(cb => crypto.pbkdf2(password, salt, 100000, 64, 'sha512', cb));
	const computedHash = hashBuffer.toString('hex');
	return computedHash === hash;
}

async function createJWT (user) {
	return jwt.sign(user, CONFIG.auth.jwtSecret);
}

module.exports = { hashPassword, compareHash, createJWT };