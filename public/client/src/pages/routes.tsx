import { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./register";
import Chat from "./chat";
import Login from "./login";
import Store from "./store";
import Pair from "./pair";
import SetAvatar from "./set-avatar";
import NotFound from "./not-found";
import { getLocalStorageUserString } from "../utils/untils";

type privateProps = { children: ReactElement};

const routes = () => {
  const PrivateRoute = (props: privateProps) => {
    const { children } = props;

    return getLocalStorageUserString() ? children : <Navigate to="/login" replace />;
  };
  const LoggedRoute = (props: privateProps) => {
    const { children } = props;
    return getLocalStorageUserString() ? <Navigate to="/" replace /> : children;
  };

  return (
    <div className="main_body">
      <Routes>
        <Route
          path="/register"
          element={
            <LoggedRoute>
              <Register />
            </LoggedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <LoggedRoute>
              <Login />
            </LoggedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <PrivateRoute>
              <Store />
            </PrivateRoute>
          }
        />
        <Route
          path="/setavatar"
          element={
            <PrivateRoute>
              <SetAvatar />
            </PrivateRoute>
          }
        />
        <Route
          path="/pair"
          element={
            <PrivateRoute>
              <Pair />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <NotFound />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default routes;
