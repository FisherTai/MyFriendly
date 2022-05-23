import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import { IUser } from "../config/interface";
import { strings } from "../config/strings";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {
  contacts: IUser[];
  changeChat: React.Dispatch<React.SetStateAction<IUser | undefined>>;
};

const Contacts = (props: Props) => {
  const { contacts, changeChat } = props;
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(
    undefined
  );
  const [currentUserImage, setCurrentUserImage] = useState<string | undefined>(
    undefined
  );
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(
    undefined
  );
  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );


  useEffect(() => {
    async function fetchData() {
      const data = await JSON.parse(localStorage.getItem(strings.LOCAL_STORAGE_USER)!);
      setCurrentUserName(data.USER_NAME);
      setCurrentUserImage(data.USER_AVATAR);
    }
    fetchData();
  }, []);

  const changeCurrentChat = (index: number, contact: IUser) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container style={variableStyle}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>{strings.APP_NAME}</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.USER_AVATAR}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.USER_NAME}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

const Container = styled.div<componentProps>`
  display: grid;
  margin: 0 0.2rem 0 0;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  background-color: ${({ style }) => style.contacts_color};
  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: ${({ style }) => style.contacts_text_color};
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
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
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: ${({ style }) => style.contacts_text_color};
        }
      }
    }
    .selected {
      background-color: ${({ style }) => style.contacts_selected_color};
    }
  }

  .current-user {
    background-color: ${({ style }) => style.contacts_myinfo};;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: ${({ style }) => style.contacts_text_color};
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
