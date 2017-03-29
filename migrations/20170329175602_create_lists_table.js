
exports.up = function(knex, Promise) {
  return Promise.all([
		knex.schema.createTable('lists',function(table) {
		  	table.increments();
		  	table.string('name').notNullable();
		  	table.string('description');
		  	table.integer('ownerId').unsigned().references('users.id');
		  	table.timestamps();
		  })
	])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('lists')
  	])
};
