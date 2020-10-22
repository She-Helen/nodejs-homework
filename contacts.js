const fs = require('fs');
const path = require('path');

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
async function listContacts() {
    const data = await fs.promises.readFile(contactsPath, "utf8");
    console.table(JSON.parse(data));
}

async function getContactById(contactId) {
    const data = await fs.promises.readFile(contactsPath, "utf8");
    const findedData = await (JSON.parse(data).find(user => user.id === contactId));
    console.log(findedData);
}

async function removeContact(contactId) {
    const data = await fs.promises.readFile(contactsPath, "utf8");
    const arr = await JSON.parse(data);
    if (arr.find(user => user.id === contactId)) {
        const filtredData = await (arr.filter(user => user.id !== contactId));
    await fs.promises.writeFile(contactsPath, JSON.stringify(filtredData), err => {
        if (err) { console.warn(err) }
    });
    const newData = await fs.promises.readFile(contactsPath, "utf8");
    console.table(JSON.parse(newData));        
    } else {
        console.log(`Contact with id=${contactId} does not exist`); 
    }
}

async function addContact(name, email, phone) {
    const data = await fs.promises.readFile(contactsPath, "utf8");
    const arr = await JSON.parse(data);
    const id = arr[arr.length - 1]['id'] + 1;
    const newContact = { id, name, email, phone };
    const contactsWithNew = [...JSON.parse(data), newContact];
    await fs.promises.writeFile(contactsPath, JSON.stringify(contactsWithNew), err => {
        if (err) { console.warn(err) }
    });
    const newData = await fs.promises.readFile(contactsPath, "utf8");
    console.table(JSON.parse(newData));
}

module.exports = { listContacts, getContactById, removeContact, addContact}