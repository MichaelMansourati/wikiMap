
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('locations',function(table) {
			table.increments('id');
			table.string('title').notNullable();
			table.text('description');
			table.string('latitude').notNullable();
			table.string('longitude').notNullable();
			table.integer('list_id').unsigned().references('lists.id');
		})
		])  
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('locations')
  	])  
};
