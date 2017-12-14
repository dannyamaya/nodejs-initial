var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

/* GET users listing. */




module.exports = router;


router.route('/')
    .post(userController.createUser);