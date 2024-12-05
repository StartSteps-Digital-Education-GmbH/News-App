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

const headlines = {
  query: Joi.object({
    country: Joi.string().optional().length(2),
    category: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(100).default(5),
  }),
};

export default { latestNews, headlines };
