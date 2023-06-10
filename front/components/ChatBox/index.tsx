import React, { FormEvent, KeyboardEvent, memo, ReactNode, useCallback, useEffect, useRef } from 'react';
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import autosize from 'autosize';
import { Mention, SuggestionDataItem } from 'react-mentions';
import useMember from '@hooks/useMember';
import { useParams } from 'react-router';
import gravatar from 'gravatar';

interface ChatBoxProps {
  chat: string;
  onSubmitForm: (e: FormEvent | KeyboardEvent) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder = '' }: ChatBoxProps) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: memberData = [] } = useMember(workspace);

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

  // eslint-disable-next-line no-empty-pattern
  const renderSuggestion = useCallback(
    (
      _suggestion: SuggestionDataItem,
      _search: string,
      highlightedDisplay: ReactNode,
      index: number,
      focus: boolean,
    ): ReactNode => {
      if (!memberData) return null;
      const member = memberData[index];
      return (
        <EachMention focus={focus}>
          <img src={gravatar.url(member.email, { s: '20px', d: 'retro' })} alt={member.nickname} />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
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
          inputRef={textAreaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData.map((m) => ({ id: m.id, display: m.nickname }))}
            renderSuggestion={renderSuggestion}
          ></Mention>
        </MentionsTextarea>
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

export default memo(ChatBox);
