const bcrypt = require('bcrypt');
const env = require('dotenv').config();

module.exports = function MakeDataHelpers(knex) {
	return {
		insertUser: function(name,email,password,callback) {
			knex.returning('id')
			.insert({name: name, email: email, password: bcrypt.hashSync(password,10) })
			.into('users').asCallback(function(err,id) {
				callback(err,id);
			})
		},
		removeUser: function(email,callback) {
			knex('users').where('email',email).del().asCallback(callback);
		},
		insertList: function(name,description,ownerEmail,callback){
			knex('users').where('email',ownerEmail).select('id').asCallback(function(err,res) {
				if (err) throw err;
				const ownerId = res[0].id;
				knex.returning('id').insert({ name: name, description: description, ownerId: ownerId })
				.into('lists').asCallback(callback);

			});
		},
		removeList: function(listName,ownerEmail,callback){
			knex('users').where('email',ownerEmail).select('id').asCallback(function(err,res) {
				const userId = res[0].id;
				if (err) throw err;
				knex('lists').where({ ownerId: userId, name: listName }).del().asCallback(callback);
			})	
		},
		addLocation: function(title,description,latitude,longitude,listId,callback) {
			knex.returning('id').insert({title: title, description: description, latitude: latitude, longitude: longitude, listId: listId})
			.into('locations').asCallback(callback);
		},
		removeLocation: function(title,listId,callback) {
			knex('lists').where({ title: title, listId: listId }).del().asCallback(callback);
		},
		getUserId: function(email,callback) {
			knex('users').where('email',email).select('id').asCallback(function(err,res) {
				callback(err,res[0].id);
			});		
		},
		loginUser: function(email,password,callback) {
			knex('users').where('email',email).select(['id','name','password'])
				.asCallback(function(err,res) { 
					if (bcrypt.compareSync(password,res[0].password)) {
						console.log(res[0].id);
						callback(err,{
							 id: res[0].id,
							 name: res[0].name,
							 email: res[0].email
						  });
					} else { callback(err) }
			})
		}
	}
}