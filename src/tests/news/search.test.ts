import request from 'supertest';
import app from '../../index';

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

    it('should handle optional parameters correctly', async () => {
      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: 'test' });
      expect(response.status).toBe(200);
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
    it('should return articles for a valid q and sortBy parameters', async () => {
      const response = await request(app).get(getSearchResultsUrl).query({
        q: 'test', 
        sortBy: 'relevancy',
      });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach((article: any) => {
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('description');
          expect(article).toHaveProperty('url');
          expect(article).toHaveProperty('source');
          expect(article).toHaveProperty('publishedAt');
        });
      }
    });

    it('should filter articles by date range', async () => {
      const fromDate = '2024-11-09';
      const toDate = '2024-11-20';
      const response = await request(app)
        .get(getSearchResultsUrl)
        .query({ q: 'test', from: fromDate, to: toDate });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach((article: any) => {
          expect(article).toHaveProperty('publishedAt');
          const publishedDate = article.publishedAt.slice(0, 10);
          expect(publishedDate >= fromDate && publishedDate <= toDate).toBe(
            true,
          );
        });
      }
    });
  });
});
