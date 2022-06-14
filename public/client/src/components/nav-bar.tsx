import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { BiStore, BiLogIn, BiRegistered } from "react-icons/bi";
import { TbFriends } from "react-icons/tb";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { MdDarkMode, MdLightMode } from "react-icons/md";

import { strings } from "../config/strings";
import Logo from "../assets/logo.png";
import { changeStyles } from "../redux/reducers/style-config-slice";
import { RootState } from "../redux/store";
import { isDaylightMode } from "../utils/untils";
import { componentProps } from "../config/style-mode-interface";
import Logout from "./logout";

const setClassName = (navData: { isActive: boolean }): string => {
  return navData.isActive ? "selected" : "";
};

const NavBar = () => {
  const dispatch = useDispatch();
  const variableStyle = useSelector((state: RootState) => state.styleMode.value);
  const currentUser = useSelector((state: RootState) => state.currentUser.value);

  return (
    <NavBarContainer className="side_bar" style={variableStyle}>
      <div className="brand">
        <img src={Logo} alt="logo" />
        <h3>{strings.APP_NAME}</h3>
      </div>
      <div className="nav">
        <button onClick={() => dispatch(changeStyles(isDaylightMode()))}>
          {isDaylightMode() ? <MdLightMode /> : <MdDarkMode />}
          {isDaylightMode() ? "日間" : "夜間"}
        </button>

        {!currentUser && (
          <NavLink className={(navData) => setClassName(navData)} to="/register">
            <BiRegistered />
            註冊
          </NavLink>
        )}

        {!currentUser && (
          <NavLink className={(navData) => setClassName(navData)} to="/login">
            <BiLogIn />
            登入
          </NavLink>
        )}

        <NavLink className={(navData) => setClassName(navData)} to="/store">
          <BiStore />
          商店
        </NavLink>

        <NavLink className={(navData) => setClassName(navData)} to="/pair">
          <TbFriends />
          配對
        </NavLink>

        <NavLink className={(navData) => setClassName(navData)} to="/">
          <BsFillChatSquareDotsFill />
          聊天
        </NavLink>

        {currentUser && <Logout />}
      </div>

      <div className="copyright">Copyright © FisherTai {new Date().getFullYear()}.</div>
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
    background-color: ${({ style }) => style.contacts_selected_color};
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    width: 100%;
    //本質上NavLink會返回的是a標籤
    a {
      color: #fff;
      font-size: 1.2rem;
      text-decoration: none;
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      padding-left: 0;
      padding-right: 0;
      display: block;
      text-align: center;
      transition: 0.2s linear;
      padding: 10px 0;
      :hover {
        border-left: 1px solid #fff;
        box-shadow: 0 0 4px rgba(255, 255, 255, 1);
        background: rgba(0, 0, 0, 0.5);
      }
    }

    button {
      padding: 10px 10px;
      cursor: pointer;
      font-weight: 100;
      text-transform: uppercase;
      border: none;
      outline: none;
      font-size: 1rem;

      background-color: transparent;
      color: #e2f3f5;
      border: 1px solid #fff;
      transition: 0.3s linear;
      border-radius: 20px;
      :hover {
        background-color: ${({ style }) => style.contacts_selected_color};
        color: #fff;
      }
    }

    svg {
      margin: 0 0.5rem 0 0;
    }
  }
  .copyright {
    color: white;
    font-size: 0.8rem;
    margin-top: auto;
  }
`;
export default NavBar;
