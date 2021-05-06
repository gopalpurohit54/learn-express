var models = require('../models');
const jwt = require('jsonwebtoken')
const HttpError = require('../http-error');

module.exports = (req, res, next) => {
    if(req.headers.token) {
        jwt.verify(req.headers.token, process.env.Token_Secret, async (error, userData) => {
            if(error) {
                if(error.expiredAt) {
                    models.Session.destroy({where: {token: req.headers.token}})
                    return next(
                        new HttpError('Session expired.', 403)
                    )
                }
                return next(
                    new HttpError('Authentication failed.', 403)
                )
            }
            let tokenData = await models.Session.findOne({
                attributes: ['token'],
                where: {
                    token: req.headers.token
                }
            })
            if(tokenData) {
                req.headers.userId = userData.userId;
                next();
            } else {
                return next(
                    new HttpError('Authentication failed.', 403)
                )
            }
        })
    } else {
        return next(
            new HttpError('Authentication failed.', 403)
        )
    }
}