var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
const passportJWT = require('../middleware/passportJWT');
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/', userController.index);
router.post('/login', userController.login);
router.post('/register', [
  body('name').not().isEmpty().withMessage('please insert name'),
  body('username').not().isEmpty().withMessage('please insert username'),
  body('password').not().isEmpty().withMessage('please insert password').isLength({min:8}).withMessage('password length 8')
], userController.register);
router.get('/me', [passportJWT.isLogin], userController.me);

module.exports = router;
