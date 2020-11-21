const { Router } = require('express');
const { registerUser, loginUser } = require('./auth.controller.js');
const {validate} = require('../helpers/validate.middleware.js')
const { registerUserSchema } = require('./auth.schemes.js')

const router = Router();

//CRUD
router.post('/auth/register', validate(registerUserSchema), registerUser)
router.post("/auth/login", validate(registerUserSchema), loginUser);
//router.delete("/sign-out", authorize, authControllerProxy.signOut);
//router.get('/', getContacts);

//router.get('/:contactId', validate(validateIdSchema, 'params'), getContactById);

//router.patch('/:contactId', validate(validateIdSchema, 'params'), validate(updateUserSchema), updateContact);

//router.delete("/:contactId", validate(validateIdSchema, 'params'), deleteContact);

exports.authRouter = router;
