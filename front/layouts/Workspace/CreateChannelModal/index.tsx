import { Button, Input, Label } from '@components/common/styles';
import Modal from '@components/Modal';
import useChannel from '@hooks/useChannel';
import useInput from '@hooks/useInput';
import useUser from '@hooks/useUser';
import axios, { AxiosError } from 'axios';
import React, { FormEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

interface CreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal = ({ show, onCloseModal }: CreateChannelModalProps) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const { data: userData } = useUser();
  const { mutate: mutateChannel } = useChannel({ workspace, userData });

  const onCreateChannel = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newChannel && newChannel.trim())) return;
        await axios.post(`/api/workspaces/${workspace}/channels`, { name: newChannel });
        mutateChannel();
        setNewChannel(() => '');
        onCloseModal();
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data, { position: 'bottom-center' });
        }
      }
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channe-input" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
