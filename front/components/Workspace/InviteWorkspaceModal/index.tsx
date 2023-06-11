/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, Label } from '@components/common/styles';
import Modal from '@components/common/Modal';
import useInput from '@hooks/useInput';
import axios, { AxiosError } from 'axios';
import React, { FormEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useWorkspaceMemberList } from '@hooks/useApi';

interface InviteWorkspaceModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const InviteWorkspaceModal = ({ show, onCloseModal }: InviteWorkspaceModalProps) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();
  const { mutateWorkspaceMemberList } = useWorkspaceMemberList();

  const onInviteMember = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newMember && newMember.trim())) return;
        await axios.post(`/api/workspaces/${workspace}/members`, { email: newMember });
        mutateWorkspaceMemberList();
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
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
