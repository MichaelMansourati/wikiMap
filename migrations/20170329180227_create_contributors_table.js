
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('contributors',function(table) {
  		table.integer('user_id').references('users.id');
  		table.integer('list_id').references('lists.id');
  		table.primary(['user_id','list_id']);
  	})
  	])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('contributors')
	])
};
