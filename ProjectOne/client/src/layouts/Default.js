import React, {useState, useEffect} from "react";
import { Container, Row, Col } from "shards-react";
import classNames from "classnames";

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

  const classes = classNames(
    "main-content",
    "p-0",
    "col-12",
  )

  return (
    <Container fluid>
    {menuVisible && <Row>
      <MainSidebar />
      <Col
        className={classes}
        lg={{ size: 10, offset: 2 }}
        md={{ size: 9, offset: 3 }}
        sm={{size: 10}}
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {children}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>}
    {!menuVisible && <Row>
      <MainSidebar />
      <Col 
        className="main-content l-4"
        lg={{ size: 12 }}
        md={{ size: 10 }}
        sm={{size: 10}}
        tag="main"
      >
          <Col style={{position: "fixed", zIndex: "10", padding: "0 15px 0 194px", width: "100%"}}>{!noNavbar && <MainNavbar />}</Col>
          <div style={{paddingTop: "60px"}}>{children}
          {!noFooter && <MainFooter />}</div>
      </Col>
    </Row>}
  </Container>
  )
};

export default DefaultLayout;
