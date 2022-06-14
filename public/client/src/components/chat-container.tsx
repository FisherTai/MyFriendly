import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./chat-input";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/api-routes";
import { IUser } from "../config/interface";
import { strings } from "../config/strings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import toastOptions from "../utils/toast-options"
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {
  currentChat: IUser;
  socket: React.MutableRefObject<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >;
};

interface MessageType {
  fromSelf: boolean;
  message: string;
}

const ChatContainer = (props: Props) => {
  const { currentChat,socket } = props;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<{fromSelf: boolean, message: string} | null>(null);
  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgRecieve", (msg) => {
        console.log(msg);
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const myInfo = await JSON.parse(
        localStorage.getItem(strings.LOCAL_STORAGE_USER)!
      );
      const { data } = await axios.post(recieveMessageRoute, {
        from: myInfo._id,
        to: currentChat._id,
      },
      { withCredentials: true });
      setMessages(data.data);
    }
    fetchData();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem(strings.LOCAL_STORAGE_USER)!)._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMsg = async (msg: string) => {
    const data = await JSON.parse(
      localStorage.getItem(strings.LOCAL_STORAGE_USER)!
    );
    console.log(msg);
    socket.current!.emit("sendMsg", {
      to: currentChat._id,
      from: data._id,
      message:msg,
    });
    try {
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      },
      { withCredentials: true });
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
              <img
                src={`data:image/svg+xml;base64,${currentChat.USER_AVATAR}`}
                alt=""
              />
            </div>
            <div className="username">
              <h3>{currentChat.USER_NAME}</h3>
            </div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "recieved"
                  }`}
                >
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
        img {
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
        color:white;
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
