const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const { readContacts, findContactById, removeContact, addContact, modifyContactById } = require('./contact.model.js')

// 1. validate request body
// 2. create id for Contact
// 3. write Contact
// 4. send Contact succesful response
exports.createContact = async (req, res, next) => {
    try {
        const contact = await addContact(req.body);
        return res.status(201).send(contact);
    }
    catch (err) {
        next(err);
    }
}

exports.getContacts = async (req, res, next) => {
    try {
        const contacts = await readContacts();
        return res.status(200).send(contacts);
    }
    catch (err) {
        next(err);
    }
}

// 1. find contact by id +
// 2. if contact is not found - throw 404 error +
// 3. return successful response +
exports.getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await findContactById(contactId);
        if (!contact) {
            return res.status(404).send({ message: "Contact not found"});
        }
        return res.status(200).send(contact);
    } catch (err) {
        next(err)
    }
}

// 1. validate req body +
// 2. find contact by id +
// 3. if contact is not found - throw 404 error +
// 4. update contact +
// 5. return successful response +
exports.updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { name, email, phone } = req.body;
        if (!(name || email || phone)) {
            return res.status(400).send({ message: "Missing fields" });
        }
        const contact = await findContactById(contactId);
        if (!contact) {
            return res.status(404).send({ message: "Contact not found" });
        }
        const updatedContact = await modifyContactById(contactId, req.body);
        return res.status(200).send(updatedContact);
    } catch (err) {
        next(err);
    }
};

// 1. find contact by id +
// 2. if contact is not found - throw 404 error +
// 3. update contacts +
// 4. return successful response +
exports.deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await findContactById(contactId);
        if (!contact) {
            return res.status(404).send({ message: "Contact not found" });
        }
        removeContact(contactId);
        return res.status(200).send({ message: "Contact deleted" });
    } catch (err) {
        next(err);
    }
}

