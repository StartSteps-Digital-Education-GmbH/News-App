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
    const existingBookmark = await bookmarkRepository.findOne({
      where: {
        news: { newsId: news.newsId },
        user: { id: user?.id },
      },
    });
    if (existingBookmark) {
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

const getBookmarkedArticle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { bookmarkId } = req.params;

  try {
    const id = parseInt(bookmarkId, 10);
    if (isNaN(id)) {
      res.status(400).send({ message: 'Invalid bookmark ID.' });
      return;
    }

    const bookmarkRepository = AppDataSource.getRepository(Bookmark);
    const bookmark = await bookmarkRepository.findOne({
      where: { bookmarkId: id },
      relations: ['news'],
    });

    if (!bookmark) {
      res.status(404).send({ message: 'Bookmark not found.' });
      return;
    }

    res.status(200).send(bookmark);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send({
      message: 'An error occurred while fetching the bookmarked article.',
      error: errorMessage,
    });
  }
};

export default { createBookmark, getBookmarkedArticle };
