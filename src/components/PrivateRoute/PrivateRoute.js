import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Agrega tu lógica de autenticación aquí
  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
