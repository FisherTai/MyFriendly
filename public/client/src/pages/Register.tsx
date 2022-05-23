import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/api-routes";
import axios from "axios";
import { strings } from "../config/strings";

type Props = {};

const Register = (props: Props) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    sex: "",
  });

  useEffect(() => {
    if (localStorage.getItem(strings.LOCAL_STORAGE_USER)) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password, sex } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
          sex,
        });
        console.log(data);
        if (data.code !== 200) {
          toast.error(data.message, toastOptions);
        } else {
          toast.success("註冊成功，即將跳轉", toastOptions);
          localStorage.setItem(
            strings.LOCAL_STORAGE_USER,
            JSON.stringify(data.data)
          );
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (e: any) {
        console.log(e.message);
      }
    }
  };

  const toastOptions: ToastOptions<{}> = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = (): boolean => {
    const { password, confirmPassword, username, email, sex } = values;
    if (password !== confirmPassword) {
      toast.error(
        "確認密碼不符合",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "用戶名至少需要3個字元",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "密碼至少需要8個字元",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email未填寫", toastOptions);
      return false;
    } else if (sex === "") {
      toast.error("性別未勾選", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo"></img>
            <h1>{strings.APP_NAME}</h1>
          </div>

          <input
            type="text"
            placeholder="用戶名"
            name="username"
            onChange={(event) => handleChange(event)}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(event) => handleChange(event)}
          />

          <input
            type="password"
            placeholder="密碼"
            name="password"
            onChange={(event) => handleChange(event)}
          />

          <input
            type="password"
            placeholder="確認密碼"
            name="confirmPassword"
            onChange={(event) => handleChange(event)}
          />

          <div className="radio_sex">
            <input
              type="radio"
              id="male"
              name="sex"
              value="1"
              onChange={(event) => handleChange(event)}
            />
            <label htmlFor="male">男</label>
            <input
              type="radio"
              id="female"
              name="sex"
              value="2"
              onChange={(event) => handleChange(event)}
            />
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

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #997af0;
    }
  }
  .radio_sex {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: white;
  }
  span {
    color: white;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        color: #997af0;
      }
    }
  }
`;

export default Register;
