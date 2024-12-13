import Joi from 'joi';

const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

const latestNews = {
  query: Joi.object({
    q: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(100).default(5),
    sortBy: Joi.string()
      .valid('relevancy', 'popularity', 'publishedAt')
      .default('publishedAt'),
  }),
};

const personalizedNews = {
  query: Joi.object({
    categories: Joi.string()
      .valid(...categories)
      .required(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).max(100).default(1),
  }),
};

const headlines = {
  query: Joi.object({
    country: Joi.string().optional().length(2),
    category: Joi.string()
      .valid(...categories)
      .optional(),
    limit: Joi.number().integer().min(1).max(100).default(5),
  }),
};

const fetchSingleArticle = {
  query: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    publishedAt: Joi.date().iso().required(),
  }),
};

export default { latestNews, headlines, personalizedNews, fetchSingleArticle };
