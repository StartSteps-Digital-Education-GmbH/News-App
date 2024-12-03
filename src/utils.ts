import axios from 'axios';
import { configs } from './config/env.js';
export const fetchFromNewsAPI = async (endpoint: string, params: any) => {
  const url = `https://newsapi.org/v2${endpoint}`;
  const response = await axios.get(url, {
    params: {
      ...params,
      apikey: configs.NEWS_API_KEY,
    },
  });
  return response.data;
};
