import type { Request, Response } from 'express';
import { fetchFromNewsAPI, formatArticlesResponse } from '../../utils.js';
import newsController from '../../modules/News/controller.js';

jest.mock('../../utils.js');

const { getPersonalizedNews } = newsController;

describe('getPersonalizedNews', () => {
  let req: Request;
  let res: Response;
  const apiMock = fetchFromNewsAPI as jest.Mock;
  const formatMock = formatArticlesResponse as jest.Mock;

  beforeEach(() => {
   
    jest.clearAllMocks();

    req = {
      query: {},
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
  });

  it('should respond with 500 if api response with error', async () => {
    apiMock.mockRejectedValue('reject-with-error')

    await getPersonalizedNews(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error in getting personalized news',
      error: 'reject-with-error'
    });
  });

  it('should respond with 500 if result can not be formatted', async () => {
    req.query = { category: 'technology', limit: '5', page: '1' };
    const mockArticles = [{ id: 1, title: 'Test Article' }];
    const mockPaginatedResponse = {
      data: mockArticles,
      currentPage: 1,
      totalPages: 1,
    };

    const formattingError = new Error('my-formatting-error');

    apiMock.mockResolvedValue({ articles: mockArticles });
    formatMock.mockImplementation(()=> { throw formattingError })

    await getPersonalizedNews(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error in getting personalized news',
      error: formattingError
    });
  });

  it('should respond with 200 and paginated articles on success', async () => {
    req.query = { category: 'technology', limit: '5', page: '1' };
    const mockArticles = [{ id: 1, title: 'Test Article' }];
    const mockPaginatedResponse = {
      data: mockArticles,
      currentPage: 1,
      totalPages: 1,
    };

    apiMock.mockResolvedValue({ articles: mockArticles });
    formatMock.mockReturnValue(mockPaginatedResponse);
   
    await getPersonalizedNews(req, res);
    
    expect(apiMock).toHaveBeenCalledWith('/top-headlines', {
      category: 'technology',
      pageSize: 5,
      page: 1,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      articles: mockArticles,
      currentPage: 1,
      totalPages: 1,
    });
  });
});
