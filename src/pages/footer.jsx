import { Typography } from "@mui/material";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  text-decoration: none;
  margin: auto;
`;
function Footer() {
  return (
    <MainContainer>
      <Typography>
        <a
          href="https://github.com/LeeCH-OeO/Weather"
          style={{ textDecoration: "none" }}
        >
          © 2022 ChiHsuan-Lee
        </a>
      </Typography>
    </MainContainer>
  );
}
export default Footer;
