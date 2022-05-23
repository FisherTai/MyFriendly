import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Register from "./pages/register";
import Chat from "./pages/chat";
import Login from "./pages/login";
import Store from "./pages/store";
import SetAvatar from "./pages/set-avatar";
import { changeStyles } from "./redux/reducers/style-config-slice";
import { isDaylightMode } from "./utils/untils"

function App() {
  //TODO: for test
  const dispatch = useDispatch();
  return (  
    <BrowserRouter>
      <button style={{zIndex:9999, position:"relative"}} onClick={() => dispatch(changeStyles(isDaylightMode()))}>change</button>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store />} />
        <Route path="/setavatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
