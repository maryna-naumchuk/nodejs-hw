import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// custom validator
const objectIdValidator = (value, helpers) => {
    return !isValidObjectId(value)
        ? helpers.message('Invalid id format')
        : value;
};

// reusable schema
export const noteIdSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: Joi.string().custom(objectIdValidator).required(),
    }),
};

// queries
export const getAllNotesSchema = {
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        perPage: Joi.number().integer().min(5).max(20).default(10),
        tag: Joi.string().valid(...TAGS),
   	    search: Joi.string().trim().empty(''),
    }),
};

// create
export const createNoteSchema = {
    [Segments.BODY]: Joi.object({
        title: Joi.string().trim().min(1).max(200).required(),
        content: Joi.string().trim().max(2000).empty(''),
        tag: Joi.string().valid(...TAGS),
    }),
};

// update
export const updateNoteSchema = {
    ...noteIdSchema,
    [Segments.BODY]: Joi.object({
        title: Joi.string().trim().min(1).max(200),
        content: Joi.string().trim().max(2000).empty(''),
        tag: Joi.string().valid(...TAGS),
    }).or('title', 'content', 'tag'),
};
