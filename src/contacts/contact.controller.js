const { ContactModel } = require('./contact.model.js')

exports.createContact = async (req, res, next) => {
    try {
        const contact = await ContactModel.create(req.body);
        return res.status(201).send(contact);
    }
    catch (err) {
        next(err);
    }
}

exports.getContacts = async (req, res, next) => {
    try {
        const contacts = await ContactModel.find();
        return res.status(200).send(contacts);
    }
    catch (err) {
        next(err);
    }
}

exports.getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await ContactModel.findById(contactId);
        if (!contact) {
            return res.status(404).send({ message: "Contact not found"});
        }
        return res.status(200).send(contact);
    } catch (err) {
        next(err)
    }
}

exports.updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { name, email, phone, subscription, password } = req.body;
        if (!(name || email || phone || subscription || password)) {
            return res.status(400).send({ message: "Missing fields" });
        }
        const updatedContact = await ContactModel.findByIdAndUpdate(contactId, req.body, {new: true});
            if (!updatedContact) {
                return res.status(404).send({ message: "Contact not found" });
            }
        return res.status(200).send(updatedContact);
    } catch (err) {
        next(err);
    }
};

exports.deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const deletedContact = await ContactModel.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).send({ message: "Contact not found" });
        }
        return res.status(200).send({ message: "Contact deleted" });
    } catch (err) {
        next(err);
    }
}

