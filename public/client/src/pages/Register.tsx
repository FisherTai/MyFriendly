import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import styled from "styled-components";

import Logo from "../assets/logo.png";
import { registerRoute } from "../utils/api-routes";
import { strings } from "../config/strings";
import toastOptions from "../utils/toast-options";
import { componentProps } from "../config/style-mode-interface";
import { setCurrentUser } from "../redux/reducers/current-user-slice";
import { RootState } from "../redux/store";
import { setLocalStorageUser } from "../utils/untils";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    sex: "",
  });

  const variableStyle = useSelector((state: RootState) => state.styleMode.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password, sex } = values;
      try {
        const { data } = await axios.post(
          registerRoute,
          {
            username,
            email,
            password,
            sex,
          },
          { withCredentials: true }
        );
        console.log(data);
        if (data.code !== 200) {
          toast.error(data.message, toastOptions());
        } else {
          toast.success("註冊成功，即將跳轉", toastOptions());
          setLocalStorageUser(data.data);
          setTimeout(() => {
            dispatch(setCurrentUser(data.data));
            navigate("/");
          }, 3000);
        }
      } catch (e: any) {
        console.log(e.message);
      }
    }
  };

  const handleValidation = (): boolean => {
    const { password, confirmPassword, username, email, sex } = values;
    if (password !== confirmPassword) {
      toast.error("確認密碼不符合", toastOptions());
      return false;
    } else if (username.length < 3) {
      toast.error("用戶名至少需要3個字元", toastOptions());
      return false;
    } else if (password.length < 8) {
      toast.error("密碼至少需要8個字元", toastOptions());
      return false;
    } else if (email === "") {
      toast.error("Email未填寫", toastOptions());
      return false;
    } else if (sex === "") {
      toast.error("性別未勾選", toastOptions());
      return false;
    }
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer style={variableStyle}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo"></img>
            <h1>{strings.APP_NAME}</h1>
          </div>

          <input type="text" placeholder="用戶名" name="username" onChange={(event) => handleChange(event)} />

          <input type="email" placeholder="Email" name="email" onChange={(event) => handleChange(event)} />

          <input type="password" placeholder="密碼" name="password" onChange={(event) => handleChange(event)} />

          <input type="password" placeholder="確認密碼" name="confirmPassword" onChange={(event) => handleChange(event)} />

          <div className="radio_sex">
            <input type="radio" id="male" name="sex" value="1" onChange={(event) => handleChange(event)} />
            <label htmlFor="male">男</label>
            <input type="radio" id="female" name="sex" value="2" onChange={(event) => handleChange(event)} />
            <label htmlFor="female">女</label>
          </div>

          <button type="submit">註冊</button>
          <span>
            已經擁有帳戶 ? <Link to="/login">登入.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div<componentProps>`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: ${({ style }) => style.text_color};
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    background-color: ${({ style }) => style.from_color};
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid ${({ style }) => style.secondary_color};
    border-radius: 0.4rem;
    color: ${({ style }) => style.text_color};
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid ${({ style }) => style.analogous_colour};
      outline: none;
    }
  }
  button {
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
  .radio_sex {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: ${({ style }) => style.text_color};
  }
  span {
    color: ${({ style }) => style.text_color};
    a {
      color: ${({ style }) => style.secondary_color};
      text-decoration: none;
      font-weight: bold;
      &:hover {
        color: ${({ style }) => style.analogous_colour};
      }
    }
  }
`;

export default Register;
