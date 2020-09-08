import { Box, BoxProps, Flex, Heading } from '@chakra-ui/core';
import React, { useCallback } from 'react';
import { useMessages } from '../../../../services/messages/useMessages';
import { User } from '../../../../services/user/useUser';
import Form from './components/Form';
import Message from './components/Message';
import { Wrapper } from './styles';

interface ChatProps extends BoxProps {
  user: User;
  socket: SocketIOClient.Socket;
}

const Chat: React.FC<ChatProps> = ({ user, socket, ...rest }) => {
  const { usersCount, messages, send } = useMessages(socket);

  const onSubmit = useCallback(
    (ev: React.SyntheticEvent<EventTarget>): void => {
      ev.preventDefault();
      const form = ev.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      form.reset();
      send((formData.get('message') as string) || '', user);
    },
    [user, send],
  );

  return (
    <Wrapper {...rest}>
      <Flex direction="column" height="100%">
        <Flex justifyContent="space-between">
          <Heading size="md">Chat</Heading>
          <div>({usersCount})</div>
        </Flex>
        <Box width="100%" mt="auto">
          {messages && messages.length > 0 ? (
            <Box py={4}>
              {messages.map((message, i) => (
                <Message
                  key={i}
                  message={message}
                  currentUserId={user.id}
                  i={i}
                />
              ))}
            </Box>
          ) : (
            <Box py={3}>No messages yet.</Box>
          )}
          <Form onSubmit={onSubmit} />
        </Box>
      </Flex>
    </Wrapper>
  );
};
export default Chat;
