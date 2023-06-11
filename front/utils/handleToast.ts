import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const handleToastError = (error: unknown) => {
  console.error(error);
  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message ?? '통신에러');
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }
};
