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
    !menuVisible && "col-12",
    menuVisible && "col-10",
    menuVisible && "offset-2"
  )

  const sizes = {
    size: (menuVisible && 10) || (!menuVisible && 12),
    offset: (menuVisible && 2) || (!menuVisible && 0)
  }

  return (
    <Container fluid>
    <Row>
      <MainSidebar />
      <Col
        className={classes}
        lg={sizes}
        md={sizes}
        sm={sizes}
        tag="main"
      >
        {menuVisible && !noNavbar && <MainNavbar />}
        {menuVisible && children}
        {menuVisible && !noFooter && <MainFooter />}
        {!menuVisible && <Col 
          className="p-0 col-10 offset-2 col-lg-10 offset-lg-2 col-md-10 offset-md-2 col-sm-10 offset-sm-2" 
          style={{position: "fixed", zIndex: "10", width: "100%"}}
          >
            {!noNavbar && <MainNavbar />}
          </Col>}
          {!menuVisible && <div style={{paddingTop: "60px"}}>{children}
          {!noFooter && <MainFooter />}</div>}
      </Col>
    </Row>
  </Container>
  )
};

export default DefaultLayout;
