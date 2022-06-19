import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { componentProps } from "../config/style-mode-interface";
import { FaRegUserCircle } from "react-icons/fa";

import { sendMessageRoute, recieveMessageRoute } from "../utils/api-routes";
import { Socket } from "socket.io-client";
import toastOptions from "../utils/toast-options";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getLocalStorageUser } from "../utils/untils";
import ChatInput from "./chat-input";

type Props = {
  socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>;
};

interface MessageType {
  fromSelf: boolean;
  message: string;
}

const ChatContainer = (props: Props) => {
  const { socket } = props;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<{ fromSelf: boolean; message: string; from: string } | null>(null);
  const variableStyle = useSelector((state: RootState) => state.styleMode.value);
  const currentChat = useSelector((state: RootState) => state.currentChat.value);

  useEffect(() => {
    if (socket.current ) {
      socket.current.on("msgRecieve", (data) => {
        setArrivalMessage({ fromSelf: false, message: data.message ,from:data.from });
      });
    }
  }, []);

  // .on內的closure會一直持續，因此將判斷房間的邏輯寫在這
  useEffect(() => {
    if(arrivalMessage?.from === currentChat?._id){
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    async function fetchData() {
      const myInfo = getLocalStorageUser()!;
      const { data } = await axios.post(
        recieveMessageRoute,
        {
          from: myInfo._id,
          to: currentChat!._id,
        },
        { withCredentials: true }
      );
      setMessages(data.data);
    }
    fetchData();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMsg = async (msg: string) => {
    const from = getLocalStorageUser()!;
    socket.current!.emit("sendMsg", {
      to: currentChat!._id,
      from: from._id,
      message: msg,
    });
    try {
      await axios.post(
        sendMessageRoute,
        {
          from: from._id,
          to: currentChat!._id,
          message: msg,
        },
        { withCredentials: true }
      );
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    } catch (error: any) {
      toast.error(error.message, toastOptions());
    }
  };

  return (
    <>
      <Container style={variableStyle}>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              {currentChat!.USER_AVATAR ? <img src={`data:image/svg+xml;base64,${currentChat!.USER_AVATAR}`} alt="" /> : <FaRegUserCircle size={50} color={variableStyle.text_color} />}
            </div>
            <div className="username">
              <h3>{currentChat!.USER_NAME}</h3>
            </div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                  <div className="content ">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
      <ToastContainer />
    </>
  );
};

const Container = styled.div<componentProps>`
  display: grid;
  grid-template-rows: 15% 75% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    border-bottom: 0.2rem solid ${({ style }) => style.border_color};
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img,svg {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: ${({ style }) => style.text_color};
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: ${({ style }) => style.scroll_bar_color};
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: ${({ style }) => style.text_color};
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        color: white;
        background-color: ${({ style }) => style.chat_sended_color};
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        border: 0.1px solid #0a0a13;
        background-color: ${({ style }) => style.chat_recieved_color};
      }
    }
  }
`;

export default ChatContainer;
