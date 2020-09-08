import React from 'react';
import {
  Redirect,
  Route,
  RouteChildrenProps,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { useUser } from '../../services/user/useUser';

export type RedirectCallback<T = unknown> = (
  routerProps: RouteChildrenProps<T>,
) => string;

export interface ProtectedRouteProps extends RouteProps {
  component: React.FC<RouteComponentProps>;
  redirect?: string | RedirectCallback<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  redirect = '/',
  ...rest
}) => {
  const { user } = useUser();
  return (
    <Route
      {...rest}
      render={(props): React.ReactElement => {
        if (user && user.id) return <Component {...rest} {...props} />;
        return (
          <Redirect
            to={typeof redirect === 'string' ? redirect : redirect(props)}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
