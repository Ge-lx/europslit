const { registerUser, loginUser } = require('../model/user');

module.exports = (router, config) => {

	router.post('/register', async (req, res) => {

		if (!req.body.username || !req.body.password) {
			return res.sendStatus(400);
		}
		
		let { token, user } = await registerUser(req.body.username, req.body.password);

		res.cookie(config.auth.tokenCookie, token, config.auth.cookieOptions);
		return res.json({
			success: true,
			user,
			token
		});
	});

	router.post('/login', async (req, res) => {

		if (!req.body.username || !req.body.password) {
			return res.sendStatus(400);
		}

		let { token, user } = await loginUser(req.body.username, req.body.password);
		res.cookie(config.auth.tokenCookie, token, config.auth.cookieOptions);

		return res.json({
			success: true,
			user,
			token
		});
	});

}