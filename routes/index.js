const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = function(knex) {
	const DataHelpers = require('../lib/DataHelpers')(knex);

	router.get('/login',(req,res) => {
		res.render('login');
	});

	router.post('/login',(req,res) => {
		if (req.body.username && req.body.password) {
			DataHelpers.loginUser(req.body.username,req.body.password,function(err,userObj){
				if (err) console.log(err);
				if (userObj) {
					req.session.user_id = userObj.id;
					req.session.email = userObj.email;
					req.session.name = userObj.name;
					res.redirect('/homepage.html');
				} else {
					res.redirect('/login');
				}
			});
		}
	});

	router.get('/register',(req,res) => {
		res.render('register');
	});

	router.post('/register',(req,res) => {
		if (req.body.password === req.body.password2 && (req.body.email && req.body.name)) {
			DataHelpers.insertUser(req.body.name,req.body.email,req.body.password,(err,arrIds) => {
				if (err) throw err;
				req.session.user_id = arrIds[0];
				req.session.email = req.body.email;
				req.session.name = req.body.name;
				res.redirect('/login');
			});
		} else {
			res.redirect('/register');
		}
		
	});
	
	return router;
}
