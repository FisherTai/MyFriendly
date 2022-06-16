import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import { io, Socket } from "socket.io-client";

import { getAllUsersRoute, host } from "../utils/api-routes";
import Contacts from "../components/contacts";
import Welcome from "../components/welcome";
import ChatContainer from "../components/chat-container";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { IUser } from "../config/interface";
import { componentProps } from "../config/style-mode-interface";
import { RootState } from "../redux/store";
import { getLocalStorageUser } from "../utils/untils";

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<undefined | IUser>(undefined);

  const variableStyle = useSelector((state: RootState) => state.styleMode.value);
  const currentChat = useSelector((state: RootState) => state.currentChat.value);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("addUser", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      setCurrentUser(getLocalStorageUser()!);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.USER_AVATAR) {
          const { data } = await axios.get(`${getAllUsersRoute}/${currentUser._id}`, { withCredentials: true });
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    fetchData();
  }, [currentUser, navigate]);

  return (
    <>
      <Container style={variableStyle}>
        <div className="container">
          <Contacts contacts={contacts} />
          {(currentChat === undefined || currentChat === null) ? <Welcome /> : <ChatContainer socket={socket} />}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div<componentProps>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  .container {
    border-radius: 2rem;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    height: 85vh;
    width: 85vw;
    background-color: ${({ style }) => style.chat_room_color};
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
