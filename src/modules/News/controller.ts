import type { Request, Response } from 'express';
import { fetchFromNewsAPI } from '../../utils.js';

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
  const { categories, limit = 10 } = req.query;

  if (!categories) {
    res
      .status(400)
      .send({ message: 'Missing required query parameter: categories' });
    return;
  }

  try {
    const news = await fetchFromNewsAPI('/everything', {
      q: categories,
      limit,
    });

    const formattedResponse = news.articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
    res.status(200).send(formattedResponse);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting personalized news', error });
  }
};

export default { getLatestNews, getPersonalizedNews };
