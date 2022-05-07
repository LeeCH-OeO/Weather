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
      <a
        href="https://github.com/LeeCH-OeO/Weather"
        style={{ textDecoration: "none" }}
      >
        Copyright © ChiHsuan-Lee
      </a>
    </MainContainer>
  );
}
export default Footer;
