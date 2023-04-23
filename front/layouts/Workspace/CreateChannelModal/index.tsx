import { Button, Input, Label } from '@components/common/styles';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useUser from '@hooks/useUser';
import axios, { AxiosError } from 'axios';
import React, { FormEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

interface CreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal = ({ show, onCloseModal }: CreateChannelModalProps) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const [newChannelUrl, onChangeNewChannelUrl, setNewChannelUrl] = useInput('');

  const { mutate } = useUser();

  const onCreateChannel = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!(newChannel && newChannel.trim())) return;
      if (!(newChannelUrl && newChannelUrl.trim())) return;
      await axios.post('/api/channel', { channel: newChannel, url: newChannelUrl });
      mutate();
      setNewChannel(() => '');
      setNewChannelUrl(() => '');
      onCloseModal();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data, { position: 'bottom-center' });
      }
    }
  }, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channe-input" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Label id="channel-url-label">
          <span>채널 url</span>
          <Input id="chaannel-url-input" value={newChannelUrl} onChange={onChangeNewChannelUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
