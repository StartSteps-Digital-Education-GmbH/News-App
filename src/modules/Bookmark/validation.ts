import Joi from 'joi';

const create = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    source: Joi.string().optional(),
    url: Joi.string().required(),
    publishedAt: Joi.date().iso().required(),
  }),
};

const getBookmarkedArticle = {
  params: Joi.object({
    bookmarkId: Joi.number().integer().required(),
  }),
};

export default { create, getBookmarkedArticle };
