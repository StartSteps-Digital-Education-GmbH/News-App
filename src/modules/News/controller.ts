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

const getTopHeadlines = async (req: Request, res: Response) => {
  const { country, category, limit } = req.query;
  try {
    const news = await fetchFromNewsAPI('/top-headlines', {
      country,
      category,
      pageSize: limit,
    });

    const transformedArticles = news.articles.map(
      (
        article: {
          title: unknown;
          description: unknown;
          url: unknown;
          source: { name: unknown };
          publishedAt: unknown;
        },
        index: number,
      ) => ({
        id: `news${index + 1}`,
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      }),
    );

    res.status(200).send(transformedArticles);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting the top headlines', error });
  }
};

export default { getLatestNews, getTopHeadlines };
