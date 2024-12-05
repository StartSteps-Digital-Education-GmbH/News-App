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

const getSources = async (req: Request, res: Response) => {
  const { language, country, category } = req.query;

  try {
    const sources = await fetchFromNewsAPI('/sources', {
      language,
      country,
      category,
    });
    res.status(200).send(sources.sources);
  } catch (error) {
    res.status(500).send({ message: 'Error in getting News Sources', error });
  }
};

export default { getLatestNews, getSources };
