import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { BiPowerOff } from "react-icons/bi";
import { logoutRoute } from "../utils/api-routes";
import { strings } from "../config/strings";

type Props = {};

const Logout = (props: Props) => {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(strings.local_storage_user)!
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
      <p>登出</p>
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
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
