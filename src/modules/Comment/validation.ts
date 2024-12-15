import Joi from 'joi';

const comments = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    source: Joi.string().required(),
    url: Joi.string().uri().required(),
    publishedAt: Joi.string().required(),
    content: Joi.string().required().min(2),
  }),
  params: Joi.object({
    newsId: Joi.number().integer().required(),
  }),
};

export default { comments };
