let knex = null;

const tableNameFor = groupName => {
	let sanitized = groupName.replace(/[^a-z,A-Z,0-9]/g, '_');
	return `split_${sanitized.toLowerCase()}`
};

const updateGroupTable = async groupId => {
	let group = await knex('group').where({id: groupId}).first().first();
	if (group && group.length < 1) {
		throw 'Group not found!';
	}

	let tableName = tableNameFor(group.name);

	await knex(tableName).columnInfo(info => {
		console.log('columnInfo for ' + tableName + ': ', info);
		console.log('You still have to code the group update');
	})
}

const createGroupTable = async groupId => {
	let group = await knex('group').where({id: groupId}).first();
	if (group && group.length < 1) {
		throw 'Group not found!';
	}

	let tableName = tableNameFor(group.name);

	if (await knex.schema.hasTable(tableName)) {
		throw `${tableName} already exists!`;
	} else {
		await knex.schema.createTable(tableName, table => {
			table.increments('id').primary();
			table.string('description').nullable();
			table.float('amount').notNullable();
			table.integer('paying_user_id')
				.notNullable()
				.unsigned();
			table.foreign('paying_user_id')
				.references('user.id');
			table.timestamp('created_at').defaultTo('now()');

			for (let memberId in group.members) {
				table.float('amount_' + memberId).nullable();
			}
		});
	}
};

const dropGroupTable = async groupId => {
	let group = await knex('group').where({id: groupId}).first();
	if (group && group.length < 1) {
		throw 'Group not found!';
	}

	let tableName = tableNameFor(group.name);

	knex.schema.hasTable(tableName, async exists => {
		if (!exists) {
			console.log('Inconsistent database! Expected table ' + tableName + ' to exist for group ' + groupId + '!');
		} else {
			return await knex.schema.dropTable(tableNameFor);
		}
	});
};

const checkSchema = async () => {
	if (await knex.schema.hasTable('user') === false) {
		await knex.schema.createTable('user', table => {
			table.increments('id').primary();
			table.string('shortId').notNullable();
			table.string('username').notNullable();
			table.string('hash').notNullable();
			table.string('salt').notNullable();
			table.timestamp('created_at').defaultTo('now()');
			table.timestamp('last_handshake').defaultTo('now()');
		});
	};

	if (await knex.schema.hasTable('group') === false) {
		await knex.schema.createTable('group', table => {
			table.increments('id').primary();
			table.string('name').notNullable();
			table.json('members');
		})
	}
};

const init = async (config) => {
	knex = require('knex')(config.knex);
	module.exports.knex = knex;
	await checkSchema();
};

module.exports = {
	init,
	knex,
	createGroupTable,
	dropGroupTable
};