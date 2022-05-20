import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getAllUsersRoute, host } from "../utils/api-routes";
import Contacts from "../components/contacts";
import Welcome from "../components/welcome";
import ChatContainer from "../components/chat-container";
import { UserType } from "../config/types";

type Props = {};

const Chat = (props: Props) => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState<UserType[]>([]);
  const [currentChat, setCurrentChat] = useState<undefined | UserType>(undefined);
  const [currentUser, setCurrentUser] = useState<undefined | UserType>(undefined);

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem("friendly-user")) {
        // TODO:
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem("friendly-user")!)
        );
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.USER_AVATAR) {
          const { data } = await axios.get(
            `${getAllUsersRoute}/${currentUser._id}`
          );
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    fetchData();
  }, [currentUser]);

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={ setCurrentChat } />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat}  />
          )}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
