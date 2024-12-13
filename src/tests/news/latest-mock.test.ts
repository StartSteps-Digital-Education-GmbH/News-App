import { Request, Response } from 'express';
import request from 'supertest';
import app from '../../index.js';
import { fetchFromNewsAPI } from '../../utils.js';
import newsController from '../../modules/News/controller.js';

jest.mock('../../utils.js');

const mockFetchFromNewsAPI = fetchFromNewsAPI as jest.Mock;

describe('news controller', () => {
  let req: Request; 
  let res: Response;

  beforeEach(async () => {
    req = {
      query: { q: 'test', limit: '10', sortBy: 'popularity' },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  it('should return articles with a 200 status code when fetchFromNewsAPI succeeds', async () => {
    const mockArticles = {
      articles: [{ title: 'News 1' }, { title: 'News 2' }],
    };
    mockFetchFromNewsAPI.mockResolvedValue(mockArticles);

    await newsController.getLatestNews(req, res);

    expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/everything', {
      q: 'test',
      limit: '10',
      sortBy: 'popularity',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockArticles.articles);
  });

  it('should return a 500 status code with an error message when fetchFromNewsAPI throws an error', async () => {
    const mockError = new Error('API Error');
    mockFetchFromNewsAPI.mockRejectedValue(mockError);

    await newsController.getLatestNews(req, res);

    expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/everything', {
      q: 'test',
      limit: '10',
      sortBy: 'popularity',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error in getting the latest News',
      error: mockError,
    });
  });
});

describe('/latest', () => {
  const mockArticles = { articles: [{ title: 'News 1' }, { title: 'News 2' }] };

  beforeEach(() => {
    jest.resetAllMocks();
    mockFetchFromNewsAPI.mockResolvedValue(mockArticles);
  });

  describe('default parameters', () => {
    it('should have default query limit parameters', async () => {
      const defaultLimit = 5;
      await request(app).get('/api/news/latest');

      expect(mockFetchFromNewsAPI).toHaveBeenCalledTimes(1);
      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith(
        '/everything',
        expect.objectContaining({ limit: defaultLimit }),
      );
    });

    it('should have default sortBy parameters', async () => {
      const defaultSortBy = 'publishedAt';
      await request(app).get('/api/news/latest');

      expect(mockFetchFromNewsAPI).toHaveBeenCalledTimes(1);
      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith(
        '/everything',
        expect.objectContaining({ sortBy: defaultSortBy }),
      );
    });
  });

  describe('valid query parameters', () => {
    it('should have correct limit parameter', async () => {
      await request(app).get('/api/news/latest?limit=11');

      expect(mockFetchFromNewsAPI).toHaveBeenCalledTimes(1);
      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith(
        '/everything',
        expect.objectContaining({ limit: 11 }),
      );
    });

    it('should have correct sortBy parameter', async () => {
      await request(app).get('/api/news/latest?sortBy=popularity');

      expect(mockFetchFromNewsAPI).toHaveBeenCalledTimes(1);
      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith(
        '/everything',
        expect.objectContaining({ sortBy: 'popularity' }),
      );
    });

    it('should have correct q parameter', async () => {
      await request(app).get('/api/news/latest?q=police');

      expect(mockFetchFromNewsAPI).toHaveBeenCalledTimes(1);
      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith(
        '/everything',
        expect.objectContaining({ q: 'police' }),
      );
    });
  });

  describe('invalid query parameters', () => {
    describe('limit', () => {
      it('should fail with higher limit', async () => {
        const res = await request(app).get('/api/news/latest?limit=101');

        expect(mockFetchFromNewsAPI).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          error: '"limit" must be less than or equal to 100',
        });
      });

      it('should fail with lower limit', async () => {
        const res = await request(app).get('/api/news/latest?limit=0');

        expect(mockFetchFromNewsAPI).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          error: '"limit" must be greater than or equal to 1',
        });
      });

      it('should fail with limit as non integer', async () => {
        const res = await request(app).get('/api/news/latest?limit=abc');

        expect(mockFetchFromNewsAPI).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: '"limit" must be a number' });
      });
    });

    describe('sortBy', () => {
      it('should fail invalid option', async () => {
        const res = await request(app).get('/api/news/latest?sortBy=title');

        expect(mockFetchFromNewsAPI).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
          error: '"sortBy" must be one of [relevancy, popularity, publishedAt]',
        });
      });
    });
  });
});
