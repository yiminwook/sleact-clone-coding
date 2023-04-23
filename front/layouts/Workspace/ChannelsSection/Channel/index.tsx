import { IChannel } from '@typings/db';
import React from 'react';

interface ChannelProps {
  channelData: IChannel;
}

const Channel = ({ channelData }: ChannelProps) => {
  console.log('test', channelData);
  return <div>{channelData.name}</div>;
};

export default Channel;
