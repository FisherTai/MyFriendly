import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { BiPowerOff } from "react-icons/bi";
import { logoutRoute } from "../utils/api-routes";
import { strings } from "../config/strings";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useCookies } from "react-cookie";
type Props = {};

const Logout = (props: Props) => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies<string>(["jwt"]);
  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(strings.LOCAL_STORAGE_USER)!
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`, { withCredentials: true });
    if (data.status === 200) {
      localStorage.clear();
      removeCookie("jwt");
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick} style={variableStyle}>
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
