import type { Request, Response } from 'express';

const getLatestNews = (req: Request, res: Response) => {
  const { q, limit, sortBy } = req.query;
  //   TODO: work on controler function
  res.send({
    q,
    limit,
    sortBy,
  });
};

export default { getLatestNews };
