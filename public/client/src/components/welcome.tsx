import React, { useState, useEffect } from "react";
import { IUser } from "../config/interface";
import styled from "styled-components";
import WelcomePic from "../assets/welcome.gif";
import { strings } from "../config/strings";

type Props = {};

const Welcome = (props: Props) => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      let username:string = await JSON.parse(
        localStorage.getItem(strings.local_storage_user)!
      ).USER_NAME;
      setUserName(username ? username : "");
    }
    fetchData();
  }, []);

  return (
    <Container>
      <img src={WelcomePic} alt="" />
      <h1>
        歡迎, <span>{userName}!</span>
      </h1>
      <h3>請選擇聊天對象</h3>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome;
