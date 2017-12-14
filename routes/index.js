var express = require('express');
var router = express.Router();
var authenticationController = require('../controllers/authenticationController');
var ensureHelper = require('../helpers/ensureHelper');
var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', ensureHelper.ensureRedirect, authenticationController.login);
router.post('/login', authenticationController.loginUser);

router.get('/logout',authenticationController.logout);



module.exports = router;