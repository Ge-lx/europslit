const crypto = require('crypto');
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

module.exports = { hashPassword, compareHash };