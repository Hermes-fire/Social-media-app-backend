const { check } = require('express-validator/check');


exports.userSignupValidator = [
    check('name','name must be 5 characters at least').isLength({ min: 5 }),
    check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({min: 4,max: 32}),
    check('password','password is required').not().isEmpty(),
    check('password','password is required')
        .isLength({min:6})
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
]

/* exports.userSignupValidator = (res,req,next) => {
    req.check('name')
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password','password is required').notEmpty()
    req.check('password')
        .isLength({min:6})
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
    const errors = req.validationErrors()
    if(errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next()
} */