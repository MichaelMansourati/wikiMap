var express = require('express');
var router = express.Router();

router.get('/login',(req,res) => {
	res.render('login');
});

router.post('/login',(req,res) => {
	console.log(req.body.username);
})

router.get('/register',(req,res) => {
	res.render('register');
})

module.exports = router;
