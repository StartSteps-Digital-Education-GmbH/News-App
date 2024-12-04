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

const getSources = {
  query: Joi.object({
    language: Joi.string().length(2).optional(), 
    country: Joi.string().length(2).optional(),  
    category: Joi.string()
      .valid('business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology')
      .optional()
  }),
};


export default { latestNews, getSources };

