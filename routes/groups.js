const group = require('../model/group');
const _ = require('lodash');
const { INVALID_GROUP_REQUEST } = require('../errorcodes');

module.exports = (router, config) => {

	router.post('/groups/', async (req, res) => {
		if (_.size(req.body.members) < 1) {
			req.body.members = [req.user.id];
		}
		if (!req.body.groupName && !req.body.members) {
			throw INVALID_GROUP_REQUEST();
		}

		let created = await group.createGroup(req.body.groupName, req.body.members);
		return res.json({success: true, created});
	});
}