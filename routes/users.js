const user = require('../model/user');

module.exports = (router, config) => {

	router.post('/signup', async (req, res) => {

		if (!req.body.username || !req.body.password) {
			return res.sendStatus(400);
		}
		
		let { token, user } = await user.addUser(req.body.username, req.body.password);

		res.cookie(config.auth.tokenCookie, token, config.auth.cookieOptions);
		return res.json({
			success: true,
			user
		});
	});

	router.post('/login', async (req, res) => {

		if (!req.body.username || !req.body.password) {
			return res.sendStatus(400);
		}

		let { token, user } = await user.loginUser(req.body.username, req.body.password);
		res.cookie(config.auth.tokenCookie, token, config.auth.cookieOptions);

		return res.json({
			success: true,
			user
		});
	});

}