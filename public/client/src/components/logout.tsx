import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { BiPowerOff } from "react-icons/bi";

import { logoutRoute } from "../utils/api-routes";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { RootState } from "../redux/store";
import { clearCurrentUser } from "../redux/reducers/current-user-slice";
import { clearContactsTab } from "../redux/reducers/chat-contacts-tab-slice";
import { clearContactsList } from "../redux/reducers/chat-contacts-list-slice";
import { clearCurrentChat } from "../redux/reducers/current-chat-slice";

import { getLocalStorageUser } from "../utils/untils";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const variableStyle = useSelector((state: RootState) => state.styleMode.value);

  const handleClick = async () => {
    const { _id } = getLocalStorageUser()!;
    const data = await axios.get(`${logoutRoute}/${_id}`, { withCredentials: true });
    if (data.status === 200) {
      localStorage.clear();
      dispatch(clearCurrentUser());
      dispatch(clearContactsTab());
      dispatch(clearContactsList());
      dispatch(clearCurrentChat());
      navigate("/login");
    }
  };
  return (
    <Button className="logout" onClick={handleClick} style={variableStyle}>
      <BiPowerOff />
      <p>登出</p>
    </Button>
  );
};

const Button = styled.button<componentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: ${({ style }) => style.chat_container_btn_color};
  border: none;
  cursor: pointer;
  p {
    font-weight: bold;
    color: #fff;
  }
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default Logout;
