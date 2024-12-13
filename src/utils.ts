import axios from 'axios';

import { configs } from './config/env.js';
import type { IArticles } from './types/types.js';
import type { FetchArticleParams } from './types/types.js';

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

export const fetchSingleArticle = async (params: FetchArticleParams) => {
  const { title, description, source, publishedAt } = params;

  let query = title;
  if (description) query += ` ${description}`;
  if (source) query += ` ${source}`;

  const queryParams = {
    q: query,
    from: publishedAt || undefined,
    to: publishedAt || undefined,
  };

  try {
    const data = await fetchFromNewsAPI('/everything', queryParams);

    if (!data.articles || data.articles.length === 0) {
      throw new Error('No articles found for the given parameters.');
    }

    return data.articles[0];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch article: ${error.response?.data?.message || error.message}`,
      );
    } else {
      throw new Error('An unknown error occurred while fetching the article.');
    }
  }
};
