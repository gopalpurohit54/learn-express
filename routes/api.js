const express = require('express');
const validator = require('../validators/validator');
const userController = require('../controller/userController');
const commentController = require('../controller/commentController')
const checkAuth = require('../middleware/checkAuth');
const followController = require('../controller/followController');

const router = express.Router();

router.post('/registration',validator.registration,userController.registration)
router.post('/login',validator.login, userController.login);
router.get('/userList', checkAuth,userController.userList)
router.post('/logout', checkAuth, userController.logout)

router.post('/comment',checkAuth, commentController.addComment);
router.get('/comment', checkAuth, commentController.getUserComment);
router.get('/allComment', checkAuth, commentController.getAllComment);

router.post('/follow', checkAuth, followController.followUser);
router.get('/followers', checkAuth, followController.getFollowers);

module.exports = router;