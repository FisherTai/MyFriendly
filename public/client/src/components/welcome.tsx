import React, { useState, useEffect } from "react";
import { IUser } from "../config/interface";
import styled from "styled-components";
import WelcomePic from "../assets/welcome.gif";
import { strings } from "../config/strings";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {};

const Welcome = (props: Props) => {
  const [userName, setUserName] = useState<string>("");
 
  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  useEffect(() => {
    async function fetchData() {
      let username: string = await JSON.parse(
        localStorage.getItem(strings.LOCAL_STORAGE_USER)!
      ).USER_NAME;
      setUserName(username ? username : "");
    }
    fetchData();
  }, []);

  return (
    <Container style={variableStyle}>
      <img src={WelcomePic} alt="" />
      <h1>
        歡迎, <span>{userName}!</span>
      </h1>
      <h3>請選擇聊天對象</h3>
    </Container>
  );
};

const Container = styled.div<componentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ style }) => style.text_color};
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: ${({ style }) => style.secondary_color};
  }
`;

export default Welcome;
