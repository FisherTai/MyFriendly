import React from "react";
import styled from "styled-components";
import Logout from "./logout";
import ChatInput from "./chat-input";
import { IUser } from "../config/interface";

type Props = {
  currentChat: IUser;
};

const ChatContainer = (props: Props) => {
  const { currentChat } = props;
  return (
    <Container>
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
        <Logout />
      </div>
      <ChatInput />
    </Container>
  );
};


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
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
          color: white;
        }
      }
    }
  }
`;

export default ChatContainer;
