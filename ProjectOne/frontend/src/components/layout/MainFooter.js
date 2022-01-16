import React from "react";
import { Container, Row } from "shards-react";

const MainFooter = () => {
  const copyright = "Blogsplorer © 2021 SampleProject"

  return (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
      <Container fluid={false}>
        <Row>
          <span className="copyright ml-auto my-auto mr-2">{copyright}</span>
        </Row>
      </Container>
    </footer>
  )
}

export default MainFooter;
