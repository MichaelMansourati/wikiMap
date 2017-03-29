
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTableIfNotExists('users',function(table) {
		  	table.increments();
		  	table.string('name').notNullable();
		  	table.string('email').notNullable();
		  	table.string('password').notNullable();
		  	table.timestamps();
		  })
	])
  
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTableIfExists('users')
		])
  
};
