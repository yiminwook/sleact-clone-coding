import React from 'react';
import { Container, Header } from '@pages/Channel/styles';
import { useParams } from 'react-router';

const ChannelPage = () => {
  const params = useParams();

  return (
    <Container>
      <Header>channel page</Header>
    </Container>
  );
};

export default ChannelPage;
