import axios from 'axios';
export const fetchExternalAPI = async (url: string, params: any) => {
  const response = await axios.get(url, { params });
  return response.data;
};
