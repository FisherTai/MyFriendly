import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/api-routes";
import { Buffer } from "buffer";
import { strings } from "../config/strings";
import toastOptions from "../utils/toast-options";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import axios from "axios";
type Props = {};

const SetAvatar = (props: Props) => {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(
    undefined
  );

  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions());
    } else {
      const user = await JSON.parse(
        localStorage.getItem(strings.LOCAL_STORAGE_USER)!
      );
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      },
      { withCredentials: true });
      console.log(data);

      if (data.data.isSet) {
        user.isAvatarImageSet = true;
        user.USER_AVATAR = data.data.image;
        localStorage.setItem(strings.LOCAL_STORAGE_USER, JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("頭像設定錯誤. 請再試一次.", toastOptions());
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(strings.LOCAL_STORAGE_USER)) navigate("/login");
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 3; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container style={variableStyle}>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container style={variableStyle}>
          <div className="title-container">
            <h1>選擇你的頭像</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            設定頭像
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

const Container = styled.div<componentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: ${({ style }) => style.text_color};
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      cursor: pointer;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid ${({ style }) => style.secondary_color};
    }
  }
  .submit-btn {
    background-color: ${({ style }) => style.secondary_color};
    color: ${({ style }) => style.btn_text_color};
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: ${({ style }) => style.analogous_colour};
    }
  }
`;

export default SetAvatar;
