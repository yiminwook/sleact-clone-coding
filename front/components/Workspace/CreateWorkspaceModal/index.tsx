/* eslint-disable react-hooks/exhaustive-deps */
import Modal from '@components/common/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@components/common/styles';
import axios from 'axios';
import React, { FormEvent, useCallback } from 'react';
import { handleToastError } from '@utils/handleToast';
import { useMydata } from '@hooks/useApi';

interface CreateWorkspaceModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const CreateWorkspaceModal = ({ show, onCloseModal }: CreateWorkspaceModalProps) => {
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newWorkspaceUrl, onChangeNewWorkspaceUrl, setNewWorkspaceUrl] = useInput('');

  const { mutateMyData } = useMydata();

  const onCreateWorkspace = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newWorkspace && newWorkspace.trim())) return;
        if (!(newWorkspaceUrl && newWorkspaceUrl.trim())) return;
        await axios.post('/api/workspaces', { workspace: newWorkspace, url: newWorkspaceUrl });
        mutateMyData();
        setNewWorkspace(() => '');
        setNewWorkspaceUrl(() => '');
        onCloseModal();
      } catch (error) {
        handleToastError(error);
      }
    },
    [newWorkspace, newWorkspaceUrl],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-label">
          <span>워크 스페이스 이름</span>
          <Input id="workspace-input" value={newWorkspace} onChange={onChangeNewWorkspace} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크 스페이스 url</span>
          <Input id="workspace-url-input" value={newWorkspaceUrl} onChange={onChangeNewWorkspaceUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
