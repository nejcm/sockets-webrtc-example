import React from 'react';
import Providers from './components/Providers';
import Routes from './components/Routes';

const App: React.FC = () => {
  return (
    <Providers>
      <Routes />
    </Providers>
  );
};
export default App;
