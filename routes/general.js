// const user = require('../model/user');

module.exports = (router, config) => {

	router.post('/home/', async (req, res) => {
		return res.json({ user: req.user });
	});
}