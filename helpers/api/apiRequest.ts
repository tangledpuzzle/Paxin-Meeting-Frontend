import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getMasterToken } from '../utils';

interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'data'> {
  data?: any;
}

const apiHelper = async <T = any>({
  url,
  method = 'GET',
  data = null,
  params = null,
}: ApiRequestConfig): Promise<T | null> => {
  try {
    const token = getMasterToken();
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        // Include additional headers as necessary.
      },
    });

    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    // Depending on your error handling policy, you may want to rethrow the error
    // or handle it differently here.
    return null;
  }
};

export default apiHelper;
