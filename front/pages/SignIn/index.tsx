import useInput from '@hooks/useInput';
import axios, { AxiosError } from 'axios';
import React, { FormEvent, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Label, Form, Input, LinkContainer, Button, Error, Success } from '@pages/SignUp/styles';
import getAxiosErrMsg from '@utils/getAxiosErrMsg';

const SignIn = () => {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [logInErrMsg, setLogInErrMsg] = useState('');
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLogInErrMsg(() => '');
      try {
        if (email && password) {
          await axios.post('/api/users/login', { email, password }, { withCredentials: true });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const errMsg = getAxiosErrMsg(error);
          setLogInErrMsg(() => errMsg);
        }
      }
    },
    [email, password],
  );
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
          {logInErrMsg !== '' ? <Error>{logInErrMsg}</Error> : null}
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

export default SignIn;
