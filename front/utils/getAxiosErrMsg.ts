import { AxiosError } from 'axios';

const getAxiosErrMsg = (error: AxiosError<string>) => {
  const errMsg = error.response?.data ?? 'Unknown Error';
  return errMsg;
};

export default getAxiosErrMsg;
