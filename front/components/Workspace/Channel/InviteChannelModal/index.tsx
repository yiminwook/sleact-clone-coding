/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, useCallback } from 'react';
import Modal from '@components/common/Modal';
import { Input, Label } from '@components/common/styles';
import useInput from '@hooks/useInput';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { useChannelMemeberList } from '@hooks/useApi';

interface InviteChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const InviteChannelModal = ({ show, onCloseModal }: InviteChannelModalProps) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { workspace, channel } = useParams();

  const { mutateChannelMemberList } = useChannelMemeberList();

  const onInviteMember = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, { email: newMember });
        mutateChannelMemberList();
        setNewMember(() => '');
        onCloseModal();
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data, { position: 'bottom-center' });
        }
      }
    },
    [newMember, workspace, channel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label>
          <span>채널 멤버초대</span>
          <Input type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
