import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnType<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialData: T): ReturnType<T> => {
  const [value, setValue] = useState<T>(initialData);
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue((pre) => {
      let curr = pre;
      if (typeof curr === 'string') {
        curr = e.target.value as unknown as T;
      }
      if (typeof curr === 'number') {
        curr = Number(e.target.value) as unknown as T;
      }
      return curr;
    });
  }, []);
  return [value, onChangeHandler, setValue];
};

export default useInput;
