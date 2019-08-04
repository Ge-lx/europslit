const { createGroupTable, tableNameFor, knex } = require('../db.js');
const _ = require('lodash')

const getGroupById = async groupId => {
	let group = await knex('group').where({id: groupId}).first();

	if (!group) {
		throw `Could not find group with id ${groupId}`;
	}
	return _.defaults(group, {
		members: []
	});
}

const createGroup = async (groupName, members) => {
	let group_entry = await knex('group').where({name: groupName});
	if (group_entry && group_entry.length > 0) {
		throw `Cannot create group ${groupName}! It already exists.`;
	} else {
		let group_id = (await knex('group').insert({
			name: groupName,
			members: members
		}))[0];

		await createGroupTable(group_id);
		return {
			id: group_id,
			name: groupName,
			members
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
const addExpense = async (groupId, expense) => {
	if (!expense.hasOwnProperty('amount') || !expense.hasOwnProperty('description') || !expense.hasOwnProperty('paying_user')) {
		throw `Invalid expense schema! Amount, description and paying_user are required!`
	}
	let splitting = expense.splitting || {};

	let group = await knex('group').where({id: groupId}).first();
	if (group && group.length < 1) {
		throw 'Group not found!';
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