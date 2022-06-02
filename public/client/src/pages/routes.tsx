import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/register";
import Chat from "../pages/chat";
import Login from "../pages/login";
import Store from "../pages/store";
import Pair from "../pages/pair";

import SetAvatar from "../pages/set-avatar";

type Props = {};

const routes = (props: Props) => {
  //權限保護
  // const PrivateRoute = (props: privateProps) => {
  //   const { children } = props;
  //   return false ? children : <Navigate to="/login" replace />;
  // };
  // const LoggedRoute = ({ children }) => {
  //   return true ? <Navigate to="/" replace /> : children;
  // };

  return (
    <div className="main_body">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store />} />
        {/* <PrivateRoute> */}
        <Route path="/setavatar" element={<SetAvatar />} />
        {/* </PrivateRoute> */}
        <Route path="/pair" element={<Pair />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default routes;
