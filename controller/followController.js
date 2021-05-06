const { validationResult } = require('express-validator')
const HttpError = require('../http-error');
const { v4: uuidv4, parse } = require('uuid');
const models = require('../models')
const { Op } = require("sequelize");
const common = require('../utils/common');
const jwt = require('jsonwebtoken');

followUser = async (req, res, next) => {
    try {
        let userId = req.headers.userId;
        let followId = req.body.followId;
        let user = await models.User.findOne({ where: {id: userId} });
        let followUser = await models.User.findOne({ where: {id: followId} });
        await user.addUser(followUser);
        res.status(200).json({message: 'Followed successfully'});
    } catch (e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

getFollowers = async (req, res, next) => {
    try {
        let userId = req.headers.userId;
        let user = await models.User.findOne({ where: {id: userId} });
        let followed = await user.getUser({
            attributes: ['id', 'first_name', 'last_name']
        });
        followed = followed.map(f => {
            let temp = f.toJSON();
            delete temp.Follow;
            return temp;
        });
        
        res.status(200).json(followed);
    } catch (e) {
        console.log(e,'/soadifioudf')
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

exports.followUser = followUser;
exports.getFollowers = getFollowers;