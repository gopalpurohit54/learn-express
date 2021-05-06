const {check, body} = require('express-validator');

exports.registration = [
    check('first_name').not().isEmpty().withMessage('Please enter first name.'),
    check('last_name').not().isEmpty().withMessage('Please enter last name.'),
    check('email').not().isEmpty().withMessage('Please enter email.').normalizeEmail().isEmail().withMessage('Enter valid email.'),
    check('password').not().isEmpty().withMessage('Please enter password.').isLength({min:6}).withMessage("Password should be atleast 6 characters long."),
    check('phone').not().isEmpty().withMessage('Please enter phone number').isLength({min: 10, max: 10}).withMessage('Phone number should be of length 10.'),
    check('dob').not().isEmpty().withMessage('Please enter Date of birth.').isDate({format:'DD-MM-YYYY'}),
    check('address').not().isEmpty().withMessage('Please enter address.'),
    check('gender').not().isEmpty().withMessage('Please select a gender.')
];

exports.login = [
    check('email').not().isEmpty().withMessage('Please enter email.').normalizeEmail().isEmail().withMessage('Enter valid email.'),
    check('password').not().isEmpty().withMessage('Please enter password.').isLength({min:6}).withMessage("Password should be atleast 6 characters long."),
];