// const user = require('../model/user');

module.exports = (router, config) => {

	router.get('/home', async (req, res) => {
		return res.json({ user: req.user });
	});
}