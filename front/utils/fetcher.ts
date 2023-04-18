import axios, { AxiosResponse } from 'axios';

const fetcher = async <T>(url: string) => {
  const axiosResult: AxiosResponse<T> = await axios.get(url, { withCredentials: true });
  return axiosResult.data;
};

export default fetcher;
