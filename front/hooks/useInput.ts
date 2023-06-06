import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';
import { MentionsInputProps } from 'react-mentions';

export type Element = HTMLInputElement | HTMLTextAreaElement | MentionsInputProps;
type ReturnType<T> = [T, (e: ChangeEvent<Element>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialData: T): ReturnType<T> => {
  const [value, setValue] = useState<T>(initialData);
  const onChangeHandler = useCallback((e: ChangeEvent<Element>) => {
    setValue((pre) => e.target.value as unknown as T);
  }, []);
  return [value, onChangeHandler, setValue];
};

export default useInput;
