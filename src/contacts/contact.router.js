const { Router } = require('express');
const { createContact, getContacts, getContactById, updateContact, deleteContact } = require('./contact.controller.js');
const {validate} = require('../helpers/validate.middleware.js')
const { addContactSchema, updateContactSchema } = require('./contact.schemes.js')

const router = Router();

//CRUD
router.post('/', validate(addContactSchema), createContact)

router.get('/', getContacts);

router.get('/:contactId', getContactById);

router.patch('/:contactId', validate(updateContactSchema), updateContact);

router.delete("/:contactId", deleteContact);

exports.contactsRouter = router;
