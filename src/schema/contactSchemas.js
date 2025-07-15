import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().allow(null, ""),
    isFavourite: Joi.boolean().truthy("true").falsy("false").default(false),
    contactType: Joi.string().valid("home", "work", "personal").required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(2).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email().allow(null, ""),
    isFavourite: Joi.boolean().truthy("true").falsy("false"),
    contactType: Joi.string().valid("home", "work", "personal"),
}).min(1);