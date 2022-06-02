import React from "react";
import NavBar from "./components/nav-bar";
import Container from "./pages/routes";
import styled from "styled-components";
import { componentProps } from "./config/style-mode-interface";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

export type privateProps = {
  children: JSX.Element;
};

function App() {
  const variableStyle = useSelector(
    (state: RootState) => state.styleMode.value
  );

  return (
    <AppStyled style={variableStyle}>
      <NavBar />
      <Container />
    </AppStyled>
  );
}

const AppStyled = styled.div<componentProps>`
  height: 100vh;
  width: 100vw;
  display: grid;
  align-items: center;
  background-color: ${({ style }) => style.main_color};
  grid-template-columns: 10% 90%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 25% 75%;
  }
  .main_body{
    display: grid;
    grid-template-rows:90% 10%;
  }
`;

export default App;
