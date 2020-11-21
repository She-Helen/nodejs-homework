const { Router } = require('express');
const { createContact, getContacts, getContactById, updateContact, deleteContact } = require('./contact.controller.js');
const {validate} = require('../helpers/validate.middleware.js')
const { addContactSchema, updateContactSchema, validateIdSchema } = require('./contact.schemes.js')

const router = Router();

//CRUD
router.post('/contacts/', validate(addContactSchema), createContact)

router.get('/contacts/', getContacts);

router.get('/contacts/:contactId', validate(validateIdSchema, 'params'), getContactById);

router.patch('/contacts/:contactId', validate(validateIdSchema, 'params'), validate(updateContactSchema), updateContact);

router.delete("/contacts/:contactId", validate(validateIdSchema, 'params'), deleteContact);

exports.contactsRouter = router;
