import React, { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import autosize from 'autosize';

interface ChatBoxProps {
  chat: string;
  onSubmitForm: (e: FormEvent | KeyboardEvent) => void;
  onChangeChat: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder = '' }: ChatBoxProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const onKeydownChat = useCallback(
    (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter' && e.shiftKey === false) {
        onSubmitForm(e);
      }
    },
    [onSubmitForm],
  );

  useEffect(() => {
    if (textAreaRef.current) {
      autosize(textAreaRef.current);
    }
  }, []);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          ref={textAreaRef}
        />
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--size_small c-wysiwyg_container__button c-wysiwyg_container__button--send  c-icon_button--default' +
              (chat?.trim() ? '' : ' c-wysiwyg_container__button--disabled c-button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
