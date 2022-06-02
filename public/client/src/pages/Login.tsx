import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/api-routes";
import axios from "axios";
import { strings } from "../config/strings";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { componentProps } from "../config/style-mode-interface";
import toastOptions from "../utils/toast-options";
type Props = {};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    sex: "",
  });

  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  useEffect(() => {
    if (localStorage.getItem(strings.LOCAL_STORAGE_USER)) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, password } = values;
      try {
        const { data } = await axios.post(
          loginRoute,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        console.log(data);
        if (data.code !== 200) {
          toast.error(data.message, toastOptions());
        } else {
          toast.success("登入成功.", toastOptions());
          localStorage.setItem(
            strings.LOCAL_STORAGE_USER,
            JSON.stringify(data.data)
          );
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (e: any) {
        console.log(e.message);
      }
    }
  };

  const handleValidation = (): boolean => {
    const { password, email } = values;
    if (password === "") {
      toast.error("錯誤的Email或密碼", toastOptions());
      return false;
    } else if (email === "") {
      toast.error("錯誤的Email或密碼", toastOptions());
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
            min="3"
            onChange={(event) => handleChange(event)}
          />

          <button type="submit">登入</button>
          <span>
            還沒擁有帳戶 ? <Link to="/register">註冊.</Link>
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
    gap: 2rem;
    background-color: ${({ style }) => style.from_color};
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
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

export default Login;
