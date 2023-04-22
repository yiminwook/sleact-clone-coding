import axios, { AxiosResponse } from 'axios';

const fetcher =
  <T>() =>
  async (url: string) => {
    const axiosResult: AxiosResponse<T> = await axios.get(url, { withCredentials: true });
    return axiosResult.data;
  };

export default fetcher;
