import React, { FormEvent, useCallback } from 'react';
import Modal from '@components/Modal';
import { Input, Label } from '@components/common/styles';
import useInput from '@hooks/useInput';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@hooks/fetcher';
import useUser from '@hooks/useUser';
import { IUser } from '@typings/db';

interface InviteChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const InviteChannelModal = ({ show, onCloseModal }: InviteChannelModalProps) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { workspace, channel } = useParams();
  const { data: userData } = useUser();
  const { mutate } = useSWR(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher<IUser[]>(),
  );

  const onInviteMember = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, { email: newMember });
        mutate();
        setNewMember(() => '');
        onCloseModal();
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data, { position: 'bottom-center' });
        }
      }
    },
    [newMember],
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
