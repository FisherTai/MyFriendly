import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi";

type Props = {};

const Logout = (props: Props) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
      <p>LOGOUT</p>
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
    margin: 0 0 0 0.5rem;
    color: #fff;
  }
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default Logout;
