import useInput from '@hooks/useInput';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Header, Label, Form, Input, LinkContainer, Button, Error, Success } from '@components/common/styles';
import getAxiosErrMsg from '@utils/getAxiosErrMsg';
import { useMydata } from '@hooks/useApi';

const SignUpPage = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  //비밀번호가 일치하는지 여부
  const [misMatchErr, setMisMatchErr] = useState(false);
  //axios Error, 에러메세지를 toast로 출력
  const [signUpErrMsg, setSignupErrMsg] = useState('');
  //회원가입 성공시 문구출력
  const [signUpSuccess, setSignupSuccess] = useState(false);

  const { myData } = useMydata();

  const onChangePassoword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMisMatchErr(() => e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMisMatchErr(() => e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignupErrMsg(() => '');
      setSignupSuccess(() => false);
      try {
        if (misMatchErr === false) {
          await axios.post('/api/users', { email, nickname, password });
          setSignupSuccess(() => true);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          const errMsg = getAxiosErrMsg(error);
          setSignupErrMsg(() => errMsg);
        }
      }
    },
    [email, nickname, password, misMatchErr],
  );

  if (myData) {
    //로그인 되어있으면 일반채널로
    return <Navigate to="/workspace/sleact/channel/일반" />;
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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        {!nickname ? <Error>닉네임을 입력해주세요</Error> : null}
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassoword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {misMatchErr ? <Error>비밀번호가 일치하지 않습니다.</Error> : null}
          {signUpErrMsg !== '' ? <Error>{signUpErrMsg}</Error> : null}
          {signUpSuccess ? <Success>회원가입이 되었습니다! 로그인하러가기</Success> : null}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/signin">로그인하러가기</Link>
      </LinkContainer>
    </section>
  );
};

export default SignUpPage;
