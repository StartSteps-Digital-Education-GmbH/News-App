import app from '../../index.js';
import request from 'supertest';
import { Request, Response } from 'express';
import { fetchFromNewsAPI } from '../../utils.js';
import newsController from '../../modules/News/controller.js';

jest.mock('../../utils.ts');
jest.mock('../../middleware/auth.ts', () =>
  jest.fn((req, res, next) => next()),
);

const mockFetchFromNewsAPI = fetchFromNewsAPI as jest.Mock;

describe('getTopHeadlines controller', () => {
  let req: Request = {} as Request;
  let res: Response = {} as Response;

  beforeEach(() => {
    req = {
      query: { country: 'de', category: 'business', limit: '10' },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  it('should return articles with a 200 status code when fetchFromNewsAPI succeeds', async () => {
    const mockArticles = {
      articles: [
        {
          title: 'News Title1',
          description: 'Description1',
          url: 'https://example.com/news1',
          source: { name: 'Source Name1' },
          publishedAt: '2024-01-01',
        },
        {
          title: 'News Title2',
          description: 'Description2',
          url: 'https://example.com/news2',
          source: { name: 'Source Name2' },
          publishedAt: '2024-01-02',
        },
      ],
    };

    mockFetchFromNewsAPI.mockResolvedValue(mockArticles);

    await newsController.getTopHeadlines(req, res);

    expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/top-headlines', {
      country: 'de',
      category: 'business',
      pageSize: '10',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([
      {
        id: 'news1',
        title: 'News Title1',
        description: 'Description1',
        url: 'https://example.com/news1',
        source: 'Source Name1',
        publishedAt: '2024-01-01',
      },
      {
        id: 'news2',
        title: 'News Title2',
        description: 'Description2',
        url: 'https://example.com/news2',
        source: 'Source Name2',
        publishedAt: '2024-01-02',
      },
    ]);
  });

  it('should return an empty array if no articles are found', async () => {
    const mockArticles = { articles: [] };

    mockFetchFromNewsAPI.mockResolvedValue(mockArticles);

    await newsController.getTopHeadlines(req, res);

    expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/top-headlines', {
      country: 'de',
      category: 'business',
      pageSize: '10',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([]);
  });

  it('should return 500 status code if the fetchFromNewsAPI throws an error', async () => {
    mockFetchFromNewsAPI.mockRejectedValue(new Error());

    await newsController.getTopHeadlines(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error in getting the top headlines',
      error: Error(),
    });
  });

  it('should return 400 for invalid query parameters', async () => {
    const res = await request(app).get('/api/news/headlines').query({
      country: 'bra',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain(
      '"country" length must be 2 characters long',
    );
  });
});
