const { validationResult } = require('express-validator')
const HttpError = require('../http-error');
const { v4: uuidv4, parse } = require('uuid');
const models = require('../models')
const { Op } = require("sequelize");
const common = require('../utils/common');
const comment = require('../models/comment');

addComment = async (req, res, next) => {
    try {
        let {comment} = req.body;
        let userId = req.headers.userId;

        await models.Comment.create({id: uuidv4(), content: comment, userId: userId});

        res.status(200).json({message: 'Comment added Successfully'});
    } catch (e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

getUserComment = async (req, res, next) => {
    try {
        let userId = req.headers.userId;

        let user = await models.User.findOne({
            where: { id: userId },
            include: [ { model: models.Comment, as: 'comments'} ]
        })
        res.status(200).json(user);
    } catch (e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

getAllComment = async (req, res, next) => {
    try {
        let comments = await models.Comment.findAll({
            attributes: ['id', 'content'],
            include: [{ model: models.User, as: 'user', attributes: ['id', 'first_name', 'last_name'] }]
        })
        res.status(200).json(comments);
    } catch (e) {
        console.log(e,'/iuefghiwefhg')
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

exports.addComment = addComment;
exports.getUserComment = getUserComment;
exports.getAllComment = getAllComment;
