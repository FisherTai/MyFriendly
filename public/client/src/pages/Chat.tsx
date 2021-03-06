import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import axios from "axios";
import styled from "styled-components";
import { io, Socket } from "socket.io-client";

import { getUserConcats, getMyReceiveInvite, host } from "../utils/api-routes";
import Contacts from "../components/contacts";
import Welcome from "../components/welcome";
import ChatContainer from "../components/chat-container";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { IUser, ExpendInvite } from "../config/interface";
import { componentProps } from "../config/style-mode-interface";
import { RootState } from "../redux/store";
import { Flags } from "../utils/untils";
import { setContactsList } from "../redux/reducers/chat-contacts-list-slice";

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const dispatch = useDispatch();

  const variableStyle = useSelector((state: RootState) => state.styleMode.value);
  const currentChat = useSelector((state: RootState) => state.currentChat.value);
  const contactsTab = useSelector((state: RootState) => state.chatContactsTab.value);
  const currentUser = useSelector((state: RootState) => state.currentUser.value);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("addUser", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.USER_AVATAR) {
          switch (contactsTab) {
            case Flags.TAB_REVICED:
              const revicedList = await (await axios.get(`${getMyReceiveInvite}`, { withCredentials: true })).data;
              const ListExpend: ExpendInvite[] = revicedList.data;
              //轉換成通訊欄可用的資料格式
              const mergeContacts: IUser[] = ListExpend.map((invite) => {
                const user:IUser = invite.SENDER;
                user.invite_id = invite._id;
                return user;
              });
              dispatch(setContactsList(mergeContacts))
              break;
            default:
              const { data } = await axios.get(`${getUserConcats}`, { withCredentials: true });
              dispatch(setContactsList(data.data))
              break;
          }
        } else {
          navigate("/setAvatar");
        }
      }
    }
    fetchData();
  }, [currentUser, navigate, contactsTab, dispatch]);

  return (
    <>
      <Container style={variableStyle}>
        <div className="container">
          <Contacts />
          {currentChat === undefined || currentChat === null ? <Welcome /> : <ChatContainer socket={socket} />}
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
