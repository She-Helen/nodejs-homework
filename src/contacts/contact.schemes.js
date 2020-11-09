const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
exports.addContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    subscription: Joi.string().required(),
    password: Joi.string().required(),
});

exports.updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    subscription: Joi.string(),
    password: Joi.string(),
})

exports.validateIdSchema = Joi.object({
    contactId: Joi.objectId(),
})