const _ = require('lodash');

const ERRORS = {
	USER_NOT_FOUND: {
		code: 'A1',
		message: 'This user does not exist.',
		help: 'Please check your spelling and try again.',
		http: 404
	},
	INVALID_LOGIN: {
		code: 'A2',
		message: 'Incorrect password.',
		http: 403
	},
	UNAUTHORIZED: {
		code: 'A3',
		message: 'This endpoint requires authentication',
		http: 401
	},
	USERNAME_TAKEN: {
		code: 'A4',
		message: 'This username is already taken',
		help: 'Please choose another username.',
		http: 409
	},
	INVALID_GROUP_REQUEST: {
		code: 'A5',
		message: `Invalid expense schema! Amount, description and paying_user are required!`,
		http: 400
	},
	GROUP_NOT_FOUND: {
		code: 'A6',
		message: 'Group not found',
		http: 404
	},
	GROUPNAME_TAKEN: {
		code: 'A7',
		message: 'This group name is already taken.',
		http: 409
	}
};

module.exports = _.mapValues(ERRORS, error_obj => {
	return (info) => {
		const err = new Error(error_obj.message);
		err.code = error_obj.code;
		err.info = {info, help: error_obj.help};
		err.http = error_obj.http;
		return err;
	};
});