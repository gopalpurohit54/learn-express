const { validationResult } = require('express-validator')
const HttpError = require('../http-error');
const { v4: uuidv4, parse } = require('uuid');
const models = require('../models')
const { Op } = require("sequelize");
const common = require('../utils/common');
const jwt = require('jsonwebtoken');

registration = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        let userExist = await models.User.findOne({where: {email: req.body.email}})
        if(userExist) {
            return next(
                new HttpError('User already exists', 409)
            )
        }
        await models.User.create({...req.body, id: uuidv4(), dob: common.getDate(req.body.dob)}).catch(error => next(
            new HttpError('Unable to add User', 500)
        ));
        // const users = await models.User.findAll().catch(error => next(
        //     new HttpError('User Added but fetching failed', 500)
        // ))
        res.status(200).json({message: 'successful'})
    } catch(e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await models.User.findOne({
            where: {email: req.body.email}
        });
        if(user === null){
            return next(
                new HttpError('User not found.',404)
            )
        }
        if(user.password !== req.body.password) {
            return next(
                new HttpError('Invalid password.', 401)
            )
        }
        // delete user.dataValues.password;
        user = user.toJSON();
        delete user.password;
        let token = jwt.sign({userId: user.id}, process.env.Token_Secret, {expiresIn: '1h'})
        await models.Session.create({token: token});
        // let tokens = await models.Session.findAll();
        user.token = token;
        res.status(200).json(user);

    } catch (e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

logout = async (req, res, next) => {
    try {
        await models.Session.destroy({
            where: { token: req.headers.token }
        })
        res.status(200).json({message: 'Logout successfully.'})
    } catch (e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

userList = async (req, res, next) => {
    try {
        let {page, limit, firstName, lastName, phone, address, email, gender, dob, sortOrder, sortValue} = req.query;
        let queryCondition = [];
        if(firstName) {
            queryCondition.push({ first_name: { [Op.like]: `%${firstName}%` }})
        }
        if(lastName) {
            queryCondition.push({ last_name: { [Op.like]: `%${lastName}%` }})
        }
        if(email) {
            queryCondition.push({ email: { [Op.like]: `%${email}%` }})
        }
        if(gender) {
            queryCondition.push({ gender: { [Op.like]: `%${gender}%` }})
        }
        if(phone) {
            queryCondition.push({ phone: { [Op.like]: `%${phone}%` }})
        }
        if(address) {
            queryCondition.push({ address: { [Op.like]: `%${address}%` }})
        }
        if(dob) {
            queryCondition.push({ dob: common.getDate(dob) })
        }
        let offset = limit * (page - 1);
        let users = await models.User.findAndCountAll({
            attributes: ['id', 'first_name', 'email', 'last_name', 'dob', 'gender', 'phone' ,'address'],
            limit: parseInt(limit),
            offset: offset,
            order: sortValue && sortOrder ? [[ sortValue, sortOrder ]] : [],
            where: queryCondition.length > 0 ? {
                [Op.and]: queryCondition
            } : {}
        });
        users = {
            totalPages: Math.ceil(users.count / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit),
            data: users.rows,
        }
        res.status(200).json(users);
    } catch (e) {
        return next(
            new HttpError('Something went wrong', 500)
        )
    }
}

exports.registration = registration;
exports.login = login;
exports.logout = logout;
exports.userList = userList;