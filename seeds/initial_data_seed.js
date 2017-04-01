
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('lists').del()
    .then(function () {
      // Inserts seed entries
      return knex('lists').insert([
        { name: 'rowValue1', description: , ownerId: },
        { name: 'rowValue2', description: , ownerId: },
        { name: 'rowValue3', description: , ownerId: }
      ]);
    });
};
