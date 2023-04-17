import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnType<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialData: T): ReturnType<T> => {
  const [value, setValue] = useState(initialData);
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(() => e.currentTarget.value as unknown as T);
  }, []);

  return [value, onChangeHandler, setValue];
};

export default useInput;
