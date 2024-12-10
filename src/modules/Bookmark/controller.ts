import type { Request, Response } from 'express';
import { News } from '../../entities/News.js';
import { AppDataSource } from '../../config/database.js';
import { Bookmark } from '../../entities/Bookmark.js';

const createBookmark = async (req: Request, res: Response) => {
  const newsRepository = AppDataSource.getRepository(News);
  const bookmarkRepository = AppDataSource.getRepository(Bookmark);
  const { title, description, source, url, publishedAt } = req.body;
  const { user } = req;
  try {
    let news = await newsRepository.findOneBy({ url });
    if (!news) {
      news = newsRepository.create({
        url,
        publishedAt,
        source,
        description,
        title,
      });
      await newsRepository.save(news);
    }
    const exsistingBookmark = await bookmarkRepository.findOne({
      where: {
        news: { newsId: news.newsId },
        user: { id: user?.id },
      },
    });
    if (exsistingBookmark) {
      res.status(400).send({ message: 'Article already bookmarked.' });
      return;
    }
    const newBookmarkedNews = bookmarkRepository.create({ news, user });
    await bookmarkRepository.save(newBookmarkedNews);
    res
      .status(201)
      .send({ message: 'Bookmark created.', bookmark: newBookmarkedNews });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'An Error occured when creating the bookmark.', error });
  }
};

export default { createBookmark };
