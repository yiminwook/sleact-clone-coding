import axios, { AxiosResponse } from 'axios';

const fetcher =
  <T>() =>
  async (url: string) => {
    console.log(url);
    const axiosResult: AxiosResponse<T> = await axios.get(url, { withCredentials: true });
    return axiosResult.data;
  };

export default fetcher;
