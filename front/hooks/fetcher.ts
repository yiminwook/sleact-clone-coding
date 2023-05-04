import axios, { AxiosResponse } from 'axios';

const fetcher = async (url: string) => {
  const axiosResult: AxiosResponse = await axios.get(url, { withCredentials: true });
  return axiosResult.data;
};

export default fetcher;
