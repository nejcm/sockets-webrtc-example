import { Flex } from '@chakra-ui/core';
import styled from '@emotion/styled';
import theme from '../../../../config/theme';

export const Wrapper = styled(Flex)`
  > div {
    width: 50%;
    margin: auto;
  }

  @media only screen and (max-width: ${() => theme.breakpoints['xl']}) {
    flex-direction: column;
    width: 100%;

    > div {
      width: 100%;
      max-height: 50%;
    }
  }
`;
