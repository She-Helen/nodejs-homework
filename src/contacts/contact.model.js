const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, "../../db/contacts.json");

async function readContacts() {
    const contacts = await fsp.readFile(contactsPath, "utf8");
    return contacts;
}

async function findContactById(contactId) {
    const contactsData = await fsp.readFile(contactsPath, "utf8");
    const contacts = await JSON.parse(contactsData);
    const findedContact = await (contacts.find(contact => contact.id === Number(contactId)));
    return findedContact;
}

async function addContact({ name, email, phone }) {
    const contactsData = await fsp.readFile(contactsPath, "utf8");
    const contacts = await JSON.parse(contactsData);
    const id = contacts[contacts.length - 1]['id'] + 1;
    const newContact = { id, name, email, phone };
    const contactsWithNew = [...contacts, newContact];
    await fsp.writeFile(contactsPath, JSON.stringify(contactsWithNew), err => {
        if (err) { throw err }
    });
    return newContact;
}

async function removeContact(id) {
    const contactsData = await fsp.readFile(contactsPath, "utf8");
    const contacts = await JSON.parse(contactsData);
    const contactIndex = await contacts.findIndex((contact) => contact.id === Number(id));
    if (contactIndex === -1) {
        return;
    } else {
        await contacts.splice(contactIndex, 1);
        await fsp.writeFile(contactsPath, JSON.stringify(contacts), err => {
            if (err) { throw err }
        });
    }
}

async function modifyContactById(id, contactParams) {
    const contactsData = await fsp.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(contactsData);
    const contactIndex = contacts.findIndex((contact) => contact.id === Number(id));
    if (contactIndex === -1) {
        return;
    } else {
        contacts[contactIndex] = await {
            ...contacts[contactIndex],
            ...contactParams,
        };
        await fsp.writeFile(contactsPath, JSON.stringify(contacts), err => {
            if (err) { throw err }
        });
        return contacts[contactIndex];
    }
}

module.exports = { readContacts, findContactById, removeContact, addContact, modifyContactById }