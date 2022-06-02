import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { strings } from "../config/strings";
import Logo from "../assets/logo.png";
import { changeStyles } from "../redux/reducers/style-config-slice";
import { isDaylightMode } from "../utils/untils";
import { componentProps } from "../config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {};

const setClassName = (navData: { isActive: boolean }): string => {
  return navData.isActive ? "selected" : "";
};

const NavBar = (props: Props) => {
  const dispatch = useDispatch();

  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  return (
    <NavBarContainer className="side_bar" style={variableStyle}>
      <div className="brand">
        <img src={Logo} alt="logo" />
        <h3>{strings.APP_NAME}</h3>
      </div>
      <div className="nav">
        <ul>
          <li>
            <button onClick={() => dispatch(changeStyles(isDaylightMode()))}>
              {isDaylightMode() ? "夜間模式" : "日間模式"}
            </button>
          </li>
          <li>
            <NavLink
              className={(navData) => setClassName(navData)}
              to="/register"
            >
              註冊
            </NavLink>
          </li>
          <li>
            <NavLink className={(navData) => setClassName(navData)} to="/login">
              登入
            </NavLink>
          </li>
          <li>
            <NavLink className={(navData) => setClassName(navData)} to="/store">
              商店
            </NavLink>
          </li>
          <li>
            <NavLink className={(navData) => setClassName(navData)} to="/pair">
              配對
            </NavLink>
          </li>
          <li>
            <NavLink className={(navData) => setClassName(navData)} to="/chat">
              聊天
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="copyright">
        Copyright © FisherTai {new Date().getFullYear()}.
      </div>
    </NavBarContainer>
  );
};
const NavBarContainer = styled.div<componentProps>`
  height: 100vh;
  display: flex;
  background-color: ${({ style }) => style.nav_bar_color};
  box-shadow: 0px 0px 6px rgba(255, 255, 255, 0.5);
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  list-style-type: none;
  padding: 1rem;
  .selected {
    background: rgba(255, 255, 255, 0.5);
  }
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
  .nav {
    li {
      margin-top: 6px;
      padding: 14px 20px;
      width: 100%;
      :hover {
        border-left: 1px solid #fff;
        box-shadow: 0 0 4px rgba(255, 255, 255, 1);
        background: rgba(0, 0, 0, 0.5);
      }
    }
    .icon {
      color: #fff;
      font-size: 20px;
      padding-right: 8px;
    }
    //本質上NavLink會返回的是a標籤
    a {
      color: #fff;
      font-size: 1.2rem;
      text-decoration: none;
      width: 100%;
    }

    button {
    }
  }
  .copyright {
    color: white;
    font-size: 0.8rem;
    margin-top: auto;
  }
`;
export default NavBar;
