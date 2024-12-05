import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
const latestNews = {
  query: Joi.object({
    q: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(100).default(5),
    sortBy: Joi.string()
      .valid('relevancy', 'popularity', 'publishedAt')
      .default('publishedAt'),
  }),
};

const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    req.query = value;
    next();
  };
};

const personalizedNews = {
  query: Joi.object({
    categories: Joi.string().required(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).max(100).default(1),
  }),
};

export default { latestNews, personalizedNews, validateQuery };
