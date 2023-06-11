/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, Label } from '@components/common/styles';
import Modal from '@components/common/Modal';
import useInput from '@hooks/useInput';
import { handleToastError } from '@utils/handleToast';
import axios from 'axios';
import React, { FormEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { useWorkspaceChannelList } from '@hooks/useApi';

interface CreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal = ({ show, onCloseModal }: CreateChannelModalProps) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const { mutateWorkspaceChannelList } = useWorkspaceChannelList();

  const onCreateChannel = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newChannel && newChannel.trim())) return;
        await axios.post(`/api/workspaces/${workspace}/channels`, { name: newChannel });
        mutateWorkspaceChannelList();
        setNewChannel(() => '');
        onCloseModal();
      } catch (error) {
        handleToastError(error);
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
