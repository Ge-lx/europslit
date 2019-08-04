const group = require('../model/group');

module.exports = (router, config) => {

	router.post('/groups/', async (req, res) => {
		if (!req.body.groupName && !req.body.admin_id && !req.body.members) {
			return res.sendStatus(400);
		}

		let created = await group.createGroup(req.body.groupName, req.body.members, {id: req.body.admin_id});
		return res.json({success: true, created})
	});
}