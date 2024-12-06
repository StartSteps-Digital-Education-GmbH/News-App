import { Request, Response } from 'express';
import { fetchFromNewsAPI } from '../../../utils.js';
import newsController from '../../../modules/News/controller.js'; 

jest.mock('../../../utils.js');

const mockFetchFromNewsAPI = fetchFromNewsAPI as jest.Mock;

describe("news controller", () => {

  it('should return articles with a 200 status code when fetchFromNewsAPI succeeds', async () => {
    const mockArticles = { articles: [{ title: 'News 1' }, { title: 'News 2' }] };
    mockFetchFromNewsAPI.mockResolvedValue(mockArticles);

    const req = {
      query: { q: 'test', limit: '10', sortBy: 'popularity' }
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as unknown as Response;


    await newsController.getLatestNews(req, res);

  
    expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/everything', {
      q: 'test',
      limit: '10',
      sortBy: 'popularity'
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockArticles.articles);
  });



  it('should return a 500 status code with an error message when fetchFromNewsAPI throws an error', async () => {
    const mockError = new Error('API Error');
    mockFetchFromNewsAPI.mockRejectedValue(mockError);

 
    const req = {
      query: { q: 'test', limit: '10', sortBy: 'popularity' }
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as unknown as Response;


    await newsController.getLatestNews(req, res);


    expect(mockFetchFromNewsAPI).toHaveBeenCalledWith('/everything', {
      q: 'test',
      limit: '10',
      sortBy: 'popularity'
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error in getting the latest News',
      error: mockError
    });
  });
});