import { Box, Flex } from '@chakra-ui/core';
import React, { useState } from 'react';
import { Redirect, RouteChildrenProps } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../services/user/useUser';
import Login from './components/Form';

const Main: React.FC<RouteChildrenProps> = () => {
  const { user, setUser } = useUser();
  const [redirect, setRedirect] = useState(false);

  const onSubmit = (ev: React.SyntheticEvent<EventTarget>): void => {
    ev.preventDefault();
    const formData = new FormData(ev.currentTarget as HTMLFormElement);
    setUser({ id: uuidv4(), name: formData.get('name') as string });
    setRedirect(true);
  };

  return (
    <>
      {user && redirect ? <Redirect to="/room" /> : null}
      <Box m="auto" width="100%" minHeight="100vh">
        <Flex minHeight="100vh" align="center" justify="center">
          <Login onSubmit={onSubmit} />
        </Flex>
      </Box>
    </>
  );
};

export default Main;
