
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('locations_images',function(table) {
  		table.increments();
  		table.string('description');
  		table.string('link');
  		table.integer('locationId').unsigned().references('locations.id');
  	})
  	])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('locations_images')
  	])
};
