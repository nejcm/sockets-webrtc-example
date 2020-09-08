import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../../../../pages/Login';
import Room from '../../../../pages/Room';
import ProtectedRoute, { RedirectCallback } from '../../../ProtectedRoute';

const redirect: RedirectCallback = () => `/`;

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <ProtectedRoute path="/room" component={Room} redirect={redirect} />
      <Route path="*" render={() => <h1>404 not found</h1>} />
    </Switch>
  );
};

export default Routes;
