import Joi from 'joi';

const createComments = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    source: Joi.string().required(),
    url: Joi.string().uri().required(),
    publishedAt: Joi.string().required(),
    content: Joi.string().required().min(2),
  }),
};

const getComments = {
  body: Joi.object({
    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
  }),
};

export default { createComments, getComments };
