import type { Request, Response } from 'express';
import {
  fetchFromNewsAPI,
  formatArticlesResponse,
  validateCategory,
} from '../../utils.js';
import type { IArticles, PaginatedResults } from 'src/types/types.js';

const getLatestNews = async (req: Request, res: Response) => {
  const { q, limit, sortBy } = req.query;
  try {
    const news = await fetchFromNewsAPI('/everything', { q, limit, sortBy });
    res.status(200).send(news.articles);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting the latest News', error });
  }
};

const getPersonalizedNews = async (req: Request, res: Response) => {
  const { categories, limit, page } = req.query;
  const category = validateCategory(categories as string);

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  try {
    const news = await fetchFromNewsAPI('/top-headlines', {
      category,
      pageSize: limitNumber,
      page: pageNumber,
    });

    const paginatedArticles: PaginatedResults<IArticles> =
      formatArticlesResponse(news.articles, pageNumber, limitNumber);

    res.status(200).send({
      articles: paginatedArticles.data,
      currentPage: paginatedArticles.currentPage,
      totalPages: paginatedArticles.totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting personalized news', error });
  }
};

export default { getLatestNews, getPersonalizedNews };
