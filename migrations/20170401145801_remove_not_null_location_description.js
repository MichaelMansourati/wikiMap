
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.alterTable('locations',function(t) {
  		t.string('title').alter();
  	})
  	])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.alterTable('locations',function(t) {
  		t.string('title').notNullable().alter();
  	})
  	])
};
