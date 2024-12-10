import axios from 'axios';

import { configs } from './config/env.js';
import type { IArticles } from './types/types.js';

export const fetchFromNewsAPI = async (endpoint: string, params: any) => {
  const url = `https://newsapi.org/v2${endpoint}`;
  const response = await axios.get(url, {
    params: {
      ...params,
      apikey: configs.NEWS_API_KEY,
    },
  });

  return response.data;
};

export const formatArticlesResponse = (
  articles: IArticles[],
  page: number,
  limit: number,
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  return {
    data: paginatedArticles,
    currentPage: page,
    totalPages: Math.ceil(articles.length / limit),
  };
};
