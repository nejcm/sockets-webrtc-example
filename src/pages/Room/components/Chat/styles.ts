import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';

export const Wrapper = styled(Box)`
  position: fixed;
  width: 300px;
  min-width=300px;
  height: 100vh;
  right: 0;
  top: 0;
  padding: 1rem;
  box-shadow: -4px 0px 4px 0px rgba(0,0,0,.08);
  background-color: #fff;
  overflow: auto;
`;
