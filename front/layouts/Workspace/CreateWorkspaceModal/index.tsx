import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useUser from '@hooks/useUser';
import { Button, Input, Label } from '@components/common/styles';
import axios, { AxiosError } from 'axios';
import React, { Dispatch, FormEvent, SetStateAction, useCallback } from 'react';
import { toast } from 'react-toastify';

interface CreateWorkspaceModalProps {
  showCreateWorkspaceModal: boolean;
  onClickCreateWorkspace: () => void;
  setShowCreateWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}

const CreateWorkspaceModal = ({
  showCreateWorkspaceModal,
  onClickCreateWorkspace,
  setShowCreateWorkspaceModal,
}: CreateWorkspaceModalProps) => {
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { mutate } = useUser();

  const onCreateWorkspace = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (!(newWorkspace && newWorkspace.trim())) return;
        if (!(newUrl && newUrl.trim())) return;
        await axios.post('/api/workspaces', { workspace: newWorkspace, url: newUrl });
        mutate();
        setShowCreateWorkspaceModal(() => false);
        setNewWorkspace(() => '');
        setNewUrl(() => '');
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data, { position: 'bottom-center' });
        }
      }
    },
    [newWorkspace, newUrl],
  );

  return (
    <Modal show={showCreateWorkspaceModal} onCloseModal={onClickCreateWorkspace}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-label">
          <span>워크 스페이스 이름</span>
          <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크 스페이스 url</span>
          <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
