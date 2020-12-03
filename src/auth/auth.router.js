const { Router } = require('express');
const { registerUser, loginUser, logout, verifyUser } = require('./auth.controller.js');
const {validate} = require('../helpers/validate.middleware.js');
const { registerUserSchema } = require('./auth.schemes.js');
const { authorize } = require('../helpers/auth.middleware');
const { asyncWrapper } = require('../helpers/async-wrapper')

const router = Router();

router.post('/register', validate(registerUserSchema), asyncWrapper(registerUser))
router.post('/login', validate(registerUserSchema), loginUser);
router.post('/logout', authorize, logout);
router.get('/verify/:verificationToken', asyncWrapper(verifyUser))

exports.authRouter = router;
