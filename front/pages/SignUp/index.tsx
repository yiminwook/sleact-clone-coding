import useInput from '@hooks/useInput';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Label, Form, Input, LinkContainer, Button, Error } from './styles';

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [misMatchError, setMisMatchError] = useState(false);

  const onChangePassoword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMisMatchError(() => e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMisMatchError(() => e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (misMatchError === false) {
        console.log('서버로 전송');
      }
      console.log(email, nickname, password, passwordCheck);
    },
    [email, nickname, password, passwordCheck],
  );

  return (
    <div id="container">
      <Header>sleact</Header>
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
          {misMatchError ? <Error>비밀번호가 일치하지 않습니다.</Error> : null}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
