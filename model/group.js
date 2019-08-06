const { createGroupTable, tableNameFor, knex } = require('../db');
const { INVALID_GROUP_REQUEST, GROUP_NOT_FOUND, GROUPNAME_TAKEN } = require('../errorcodes')
const _ = require('lodash')

const getGroupByShortId = async groupId => {
	let group = await knex('group').where({shortId: groupId}).first();

	if (!group) {
		throw GROUP_NOT_FOUND({ groupId });
	}
	return _.defaults(group, {
		members: []
	});
}

const createGroup = async (groupName, members) => {
	let group_entry = await knex('group').where({name: groupName});
	if (group_entry && group_entry.length > 0) {
		throw GROUPNAME_TAKEN({ groupName });
	} else {
		let createdGroup = await knex('group').insert({
			name: groupName,
			members: members
		}).first();

		await createGroupTable(createdGroup.id);
		return {
			group: createGroup
		}
	}
};

/* Expense Data format:

{
	amount: <float>,
	description: <string>,
	paying_user: <object:user>,
	spliting: {
		<< for member_id in group.members >>
		member_id: <<float>>            // <--- the weight (default: 1)
	}
}

*/
const addExpense = async (groupShortId, expense) => {
	if (!expense.hasOwnProperty('amount') || !expense.hasOwnProperty('description') || !expense.hasOwnProperty('paying_user')) {
		throw INVALID_GROUP_REQUEST();
	}
	let splitting = expense.splitting || {};

	let group = await knex('group').where({ shortId: groupShortId }).first();
	if (group && group.length < 1) {
		throw GROUP_NOT_FOUND();
	}

	let tableName = tableNameFor(group.name);
	let weight_sum = splitting.reduce((acc, amount) => acc + amount, 0);
	let amount_mapped = {};

	for (user_id in group.members) {
		weight = splitting.hasOwnProperty(user_id) ? splitting[user_id] : 1;
		amount_mapped[`amount_${user_id}`] = weight / weight_sum;
	}
	
	await knex(tableName).insert({
		description: expense.description,
		amount: expense.amount,
		paying_user_id: expense.paying_user.id,
		...amount_mapped 
	})

	console.log('Expense added: ', expense);
}

module.exports = {
	createGroup,
	addExpense
}