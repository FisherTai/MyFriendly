import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker, { IEmojiData } from "emoji-picker-react";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {
  handleSendMsg: Function;
};

const ChatInput = (props: Props) => {
  const { handleSendMsg } = props;
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    emojiObject: IEmojiData
  ) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <Container style={variableStyle}>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="輸入你想說的話"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

const Container = styled.div<componentProps>`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  border-top:0.2rem solid ${({ style }) => style.border_color};
  background-color: ${({ style }) => style.chat_color};
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: ${({ style }) => style.btn_text_color};
    gap: 1rem;  
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ff8040;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: ${({ style }) => style.emoji_picker_color};
        box-shadow: 0 5px 10px ${({ style }) => style.emoji_picker_border_color};
        border-color: ${({ style }) => style.emoji_picker_border_color};
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: ${({ style }) => style.chat_color};
          width: 5px;
          &-thumb {
            background-color: ${({ style }) => style.scroll_bar_color};
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: ${({ style }) => style.emoji_picker_border_color};
          color:${({ style }) => style.text_color};
        }
        .emoji-group:before {
          background-color: ${({ style }) => style.emoji_picker_color};
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: ${({ style }) => style.chat_input_color};
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: ${({ style }) => style.text_color};
      border: none;
      padding-left: 1rem;
      font-size: 1rem;
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${({ style }) => style.chat_container_btn_color};
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: ${({ style }) => style.btn_text_color};
      }
    }
  }
`;

export default ChatInput;
