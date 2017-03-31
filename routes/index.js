const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = function(knex) {
	const DataHelpers = require('../lib/DataHelpers')(knex);

	router.get('/',(req,res) => {
		if (req.session) {
			res.render('index',{ name: req.session.name });	
		} else {
			res.render('index');
		}

	})

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
					res.redirect('/');
				} else {
					res.redirect('/login');
				}
			});
		}
	});

	router.post('/logout',(req,res) => {
		req.session = null;
		res.redirect('/');
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
	// Get all lists
	router.get('/lists',(req,res) => {
		DataHelpers.getLists((err,listsObj) => {
			res.json(listsObj);
		})
	});

	// Create a new list
	router.post('/lists',(req,res) => {
		if (req.session.name) {
			DataHelpers.insertList(req.body.listname,req.body.description,req.session.user_id,function(err,response) {
				res.send(response);
			})
		} else {
			console.log(req.session);
			res.send('Only logged in users can create lists');
		}
	});

	router.get('/lists/:id/locations',(req,res) => {
		DataHelpers.getLocationsByListId(req.params.id,(err,locations) => {
			res.send(locations);
		})
	});

	router.post('/lists/:id/locations',(req,res) => {
		
	});

	router.get('/lists/:list_id/locations/:id/images',(req,res) => {
		DataHelpers.getAllLocationImages(req.params.id,(err,imagesArr) => {
			res.json(imagesArr);
		})
	});
	
	return router;
}
