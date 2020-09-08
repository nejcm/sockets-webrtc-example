import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { Global } from '@emotion/core';
import React from 'react';
//import {Provider} from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { settings } from '../../../../config';
import customTheme from '../../../../config/theme';
import globalStyles from './styles';

export interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Global styles={globalStyles} />
      <BrowserRouter basename={settings.basename}>{children}</BrowserRouter>
    </ThemeProvider>
  );
};
export default Providers;
