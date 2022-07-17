import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import styled from "styled-components";

import ContactsItem from "./contacts-item";
import Logo from "../assets/logo.png";
import { strings } from "../config/strings";
import { componentProps } from "../config/style-mode-interface";
import { RootState } from "../redux/store";
import { getLocalStorageUser } from "../utils/untils";
import { setContactsTab } from "../redux/reducers/chat-contacts-tab-slice";
import { Flags } from "../utils/untils";

type Props = {
};

const TAB_CURRENT = "currentTab";

const Contacts = (props: Props) => {
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [currentUserImage, setCurrentUserImage] = useState<string | undefined>(undefined);
  const [currentSelected, setCurrentSelected] = useState<number | undefined>(undefined);
  const dispatch = useDispatch();

  const variableStyle = useSelector((state: RootState) => state.styleMode.value);
  const currentTab = useSelector((state: RootState) => state.chatContactsTab.value);
  const contacts = useSelector((state: RootState) => state.chatContactsList.value);

  useEffect(() => {
    async function fetchData() {
      const { USER_NAME, USER_AVATAR } = getLocalStorageUser()!;
      setCurrentUserName(USER_NAME);
      setCurrentUserImage(USER_AVATAR);
    }
    fetchData();
  }, []);

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container style={variableStyle}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>{strings.APP_NAME}</h3>
          </div>
          <nav>
            <ul>
              <li className={`contact ${Flags.TAB_CONTACT === currentTab ? TAB_CURRENT : ""}`}>
                <input type="button" value="聯絡人" onClick={() => dispatch(setContactsTab(Flags.TAB_CONTACT))} />
              </li>
              {/* <li className={`contact ${Flags.TAB_SENDED === currentTab ? TAB_CURRENT : ""}`}>
                <input type="button" value="邀請" onClick={() => dispatch(setContactsTab(Flags.TAB_SENDED))} />
              </li> */}
              <li className={`contact ${Flags.TAB_REVICED === currentTab ? TAB_CURRENT : ""}`}>
                <input type="button" value="收到邀請" onClick={() => dispatch(setContactsTab(Flags.TAB_REVICED))} />
              </li>
            </ul>
          </nav>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <ContactsItem key={contact._id} contact={contact} index={index} currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} />
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
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
  grid-template-rows: 8vh 8vh 60vh 9vh;
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

  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    background-color: #333;
    ul {
      li {
        list-style: none;
        display: inline-block;
        padding: 0 20px;
        transition: 0.2s linear;
        :hover {
          box-shadow: 0 0 4px rgba(255, 255, 255, 1);
        }
      }
      input {
        font-size: 1rem;
        color: #fff;
        background-color: transparent;
        border: none;
        display: block;
        padding: 10px 0;
        cursor: pointer;
      }
      .currentTab {
        background-color: #ffffff20;
        :hover {
        }
      }
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
        img,
        svg {
          height: 3rem;
          width: 4rem;
        }
      }
      .username {
        h3 {
          color: ${({ style }) => style.contacts_text_color};
        }
      }
      .invite {
        button {
          padding: 3px 3px;
          margin: 0.2rem 0.1rem;
          cursor: pointer;
          font-weight: 400;
          text-transform: uppercase;
          border: none;
          outline: none;
          font-size: 1.3rem;
          border-radius: 6px;
          background-color: #17b978;
          color: #fff;
        }
        .reject {
          background-color: red;
        }
      }
    }
    .selected {
      background-color: ${({ style }) => style.contacts_selected_color};
    }
  }

  .current-user {
    background-color: ${({ style }) => style.contacts_myinfo};
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
