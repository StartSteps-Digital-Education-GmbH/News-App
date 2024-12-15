import type { Request, Response } from 'express';
import { AppDataSource } from '../../config/database.js';
import { News } from '../../entities/News.js';
import { Comment } from '../../entities/Comment.js';
import type { User } from '../../entities/User.js';

const commentRepository = AppDataSource.getRepository(Comment);
const newsRepository = AppDataSource.getRepository(News);

const commentOnNewsArticle = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { title, description, source, url, publishedAt, content } = req.body;

  try {
    let newsArticle = await newsRepository.findOneBy({ url });

    if (!newsArticle) {
      newsArticle = newsRepository.create({
        url,
        publishedAt,
        source,
        description,
        title,
      });
      await newsRepository.save(newsArticle);
    }

    const comment = commentRepository.create({
      content,
      user: { id: userId } as User,
      news: { newsId: newsArticle.newsId } as News,
    });

    await commentRepository.save(comment);

    res.status(201).send({
      content: comment,
      message: 'Comment added successfully',
    });
  } catch (err: unknown) {
    res.status(500).send({
      message: 'Error in commenting on the news article',
      error: (err as Error).message,
    });
  }
};

const getNewsComments = async (req: Request, res: Response) => {
  const newsId = parseInt(req.params.newsId);

  try {
    const news = await newsRepository.findOneBy({ newsId });
    if (!news) {
      res.status(404).send({ message: 'No News Found with this ID' });
    }

    const newsComments = await commentRepository.find({
      where: { news: { newsId } },
      relations: ['news', 'user'],
      select: {
        user: {
          name: true,
        },
      },
    });

    res
      .status(200)
      .send({ message: 'Comment successfully retrieved ', data: newsComments });
  } catch (err) {
    res.status(500).send({
      message: 'Error in commenting on the news article',
      error: (err as Error).message,
    });
  }
};

export default { commentOnNewsArticle, getNewsComments };
