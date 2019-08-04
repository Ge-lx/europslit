const user = require('../model/user');

module.exports = (router, config) => {

	router.post('/users/', async (req, res) => {

		if (!req.body.username || !req.body.password) {
			return res.sendStatus(400);
		}
		
		let { token, user: createdUser } = await user.addUser(req.body.username, req.body.password);

		res.cookie(config.auth.tokenCookie, token, config.auth.cookieOptions);
		return res.json({
			success: true,
			user: createdUser
		});
	})

}