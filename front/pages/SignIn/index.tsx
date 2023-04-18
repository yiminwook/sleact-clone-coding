import useInput from '@hooks/useInput';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { FormEvent, useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header, Label, Form, Input, LinkContainer, Button, Error } from '@pages/SignUp/styles';
import getAxiosErrMsg from '@utils/getAxiosErrMsg';
import useUser, { userDataType } from '@hooks/useUser';

const SignInPage = () => {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [signInErrMsg, setSignInErrMsg] = useState('');
  const { data, mutate, isLoading } = useUser();

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignInErrMsg(() => '');
      try {
        if (email && password) {
          const signinResult: AxiosResponse<userDataType | boolean> = await axios.post(
            '/api/users/login',
            { email, password },
            { withCredentials: true },
          );
          mutate(signinResult.data, false);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          const errMsg = getAxiosErrMsg(error);
          setSignInErrMsg(() => errMsg);
        }
      }
    },
    [email, password],
  );

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (data && typeof data === 'object') {
    return <Navigate to="/workspace/channel" replace />;
  }

  return (
    <section id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label>
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {signInErrMsg !== '' ? <Error>{signInErrMsg}</Error> : null}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아닌신가요? &nbsp;
        <Link to="/signup">회원가입하러 가기</Link>
      </LinkContainer>
    </section>
  );
};

export default SignInPage;
