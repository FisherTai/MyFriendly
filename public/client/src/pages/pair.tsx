import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import { FaRegUserCircle } from "react-icons/fa";

import { getAllUsersRoute } from "../utils/api-routes";
import { IUser } from "../config/interface";
import { componentProps } from "../config/style-mode-interface";
import { RootState } from "../redux/store";


const Pair = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<IUser[]>([]);
  const [invitedList, setInvitedList] = useState<number[]>([]);

  const variableStyle = useSelector((state: RootState) => state.styleMode.value);

  const currentUser = useSelector((state: RootState) => state.currentUser.value);

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

  const sendInvitation = (index: number, contact: IUser) => {
    if (invitedList.includes(index)) {
      return;
    }
    setInvitedList([...invitedList, index]);
  };

  return (
    <Container style={variableStyle}>
      <div className="brand">
        <h1>選擇對象送出邀請</h1>
      </div>
      <div className="contacts">
        {contacts.map((contact, index) => {
          return (
            <div key={contact._id} className={`contact`}>
              <div className="avatar">
                {contact.USER_AVATAR ? <img src={`data:image/svg+xml;base64,${contact.USER_AVATAR}`} alt="" /> : <FaRegUserCircle size={70} color="white" />}
              </div>
              <div className="username">
                <h3>{contact.USER_NAME}</h3>
              </div>
              <button className={`invite ${invitedList.includes(index) ? "selected" : ""}`} onClick={() => sendInvitation(index, contact)}>
                邀請
              </button>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

const Container = styled.div<componentProps>`
  height: 100vh;
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  background-color: ${({ style }) => style.contacts_color};

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h1 {
      color: ${({ style }) => style.contacts_text_color};
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    align-items: center;
    overflow: auto;
    gap: 3rem;
    padding:3rem;
    &::-webkit-scrollbar {
      width: 0.5rem;
      &-thumb {
        background-color: ${({ style }) => style.scroll_bar_color};
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 20%;
      min-width: 15%;
      width: 15%;
      border-radius: 0.2rem;
      padding: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img,svg{
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: ${({ style }) => style.contacts_text_color};
        }
      }
      .invite {
        padding: 0.5rem 1.2rem;
        cursor: pointer;
        font-weight: 400;
        text-transform: uppercase;
        border: none;
        outline: none;
        font-size: 1rem;
        border-radius: 1rem;
        background-color: #fc5185;
        transition: 0.2s ease-in-out;
        color: #fff;
        :hover {
          padding: 0.7rem 1.5rem;
        }
      }
      .selected {
        background-color: #7a7a7a;
        :hover {
          padding: 0.5rem 1.2rem;
        }
      }
    }
  }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
    }
  }
`;
export default Pair;
