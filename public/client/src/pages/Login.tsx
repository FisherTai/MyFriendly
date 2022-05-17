import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/api-routes";
import axios from "axios";

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

  useEffect(() => {
    if (
      localStorage.getItem(
        /*process.env.REACT_APP_LOCALHOST_KEY*/ "friendly-user"
      )
    ) {
      //TODO:
      navigate("/");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          email,
          password,
        });
        console.log(data);
        if (data.code !== 200) {
          toast.error(data.message, toastOptions);
        } else {
          toast.success("登入成功.", toastOptions);
          localStorage.setItem(
            // process.env.REACT_APP_LOCALHOST_KEY, //TODO:
            "friendly-user",
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

  const toastOptions: ToastOptions<{}> = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = (): boolean => {
    const { password, email } = values;
    if (password === "") {
      toast.error("錯誤的Email或密碼", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("錯誤的Email或密碼", toastOptions);
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
            <h1>Friendly</h1>
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

export default Login;
