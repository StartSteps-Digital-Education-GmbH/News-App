import request from 'supertest';
import app from '../../index';
import { fetchFromNewsAPI } from '../../utils.js';
import newsController from '../../modules/News/controller.js';
import { Request, Response } from 'express';

jest.mock('../../middleware/auth.ts', () =>
  jest.fn((req, res, next) => next()),
);

jest.mock('../../utils.ts', () => ({
  fetchFromNewsAPI: jest.fn(),
}));

const mockFetchFromNewsAPI = fetchFromNewsAPI as jest.Mock;

const getSearchResultsUrl = '/api/news/search';

describe('GET /api/news/search', () => {
  describe('Validation', () => {
    it('should validate required q parameter and return a 400 if q is missing', async () => {
      const response = await request(app).get(getSearchResultsUrl);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('"q" is required');
    });

    it('should validate required q parameter and return a 400 if q is invalid', async () => {
      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: '' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('"q" is not allowed to be empty');
    });

    it('should return 400 for invalid date formats in from', async () => {
      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: 'test', from: 'invalid-date-format' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        '"from" must be in ISO 8601 date format',
      );
    });

    it('should return 400 for invalid date formats in to', async () => {
      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: 'test', to: 'invalid-date-format' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('"to" must be in ISO 8601 date format');
    });

    it('should return 400 for invalid sortBy value', async () => {
      const response = await request(app).get(getSearchResultsUrl).query({
        q: 'test',
        sortBy: 'invalid: not relevancy, popularity, or publishedAt',
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        '"sortBy" must be one of [relevancy, popularity, publishedAt]',
      );
    });
  });

  describe('API Response Tests', () => {
    const mockArticles = {
      articles: [
        {
          title: 'Test one',
          description: 'Test description one',
          url: 'https://test.com/newsone',
          source: { name: 'Test source one' },
          publishedAt: '2024-11-01',
        },
        {
          title: 'Test two',
          description: 'Test description two',
          url: 'https://test.com/newstwo',
          source: { name: 'Test source two' },
          publishedAt: '2024-01-02',
        },
        {
          title: 'Test three',
          description: 'Test description three',
          url: 'https://test.com/newsthree',
          source: { name: 'Test source three' },
          publishedAt: '2024-01-03',
        },
      ],
    };

    beforeEach(() => {
      mockFetchFromNewsAPI.mockClear();
    });

    it('should handle optional parameters correctly', async () => {
      mockFetchFromNewsAPI.mockResolvedValueOnce(mockArticles);

      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: 'test' });

      expect(response.status).toBe(200);
      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/everything', {
        q: 'test',
      });
      expect(response.body).toEqual(mockArticles.articles);
    });

    it('should return articles for a valid q, date filtering, and sortBy parameters', async () => {
      const req: Request = {
        query: {
          q: 'test',
          from: '2024-11-01',
          to: '2024-11-02',
          sortBy: 'publishedAt',
        },
      } as unknown as Request;
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      mockFetchFromNewsAPI.mockResolvedValue(mockArticles);

      await newsController.getSearchResults(req, res);

      expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/everything', {
        q: 'test',
        from: '2024-11-01',
        to: '2024-11-02',
        sortBy: 'publishedAt',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            title: 'Test one',
            description: 'Test description one',
            url: 'https://test.com/newsone',
            source: { name: 'Test source one' },
            publishedAt: '2024-11-01',
          },
          {
            title: 'Test two',
            description: 'Test description two',
            url: 'https://test.com/newstwo',
            source: { name: 'Test source two' },
            publishedAt: '2024-01-02',
          },
        ]),
      );
    });

    it('should return 500 if fetchFromNewsAPI fails', async () => {
      mockFetchFromNewsAPI.mockRejectedValueOnce(new Error('API error'));

      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: 'test' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error in fetching search results');
    });
  });
});
