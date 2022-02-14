import React, {useState, useEffect} from "react";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import { Store } from "../flux";

const DefaultLayout = ({ children, noNavbar, noFooter }) => {
  const [menuVisible, setMenuVisible] = useState(Store.getMenuState())

  useEffect(()=> {
    Store.addChangeListener(setVisible)

    return() => Store.removeChangeListener(setVisible)
  }, [])

  const setVisible = () => {
    setMenuVisible(Store.getMenuState())
  }

  return (
    <Container fluid>
    <Row>
      <MainSidebar />
      <Col
        className="main-content p-0"
        lg={{ size: 10, offset: 2 }}
        md={{ size: 9, offset: 3 }}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {menuVisible && children}
        {menuVisible && !noFooter && <MainFooter />}
      </Col>
    </Row>
    {!menuVisible && <Row>
      <Col 
        lg={{ size: 12 }}
        md={{ size: 10}}
        sm="12"
      >
          {children}
          {!noFooter && <MainFooter />}
      </Col>
    </Row>}
  </Container>
  )
};

export default DefaultLayout;
