import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useUser from '@hooks/useUser';
import { Button, Input, Label } from '@components/common/styles';
import axios, { AxiosError } from 'axios';
import React, { FormEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

interface CreateWorkspaceModalProps {
  showCreateWorkspaceModal: boolean;
  onCloseModal: () => void;
}

const CreateWorkspaceModal = ({ showCreateWorkspaceModal, onCloseModal }: CreateWorkspaceModalProps) => {
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newWorkspaceUrl, onChangeNewWorkspaceUrl, setNewWorkspaceUrl] = useInput('');

  const { mutate } = useUser();

  const onCreateWorkspace = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newWorkspace && newWorkspace.trim())) return;
        if (!(newWorkspaceUrl && newWorkspaceUrl.trim())) return;
        await axios.post('/api/workspaces', { workspace: newWorkspace, url: newWorkspaceUrl });
        mutate();
        setNewWorkspace(() => '');
        setNewWorkspaceUrl(() => '');
        onCloseModal();
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data, { position: 'bottom-center' });
        }
      }
    },
    [newWorkspace, newWorkspaceUrl],
  );

  return (
    <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
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
