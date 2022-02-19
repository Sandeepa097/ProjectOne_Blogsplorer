import React from "react";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";

const MainNavbar = () => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    "sticky-top",
  );

  return (
    <div className={classes}>
      <Container className="p-0">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap flex-sm-nowrap flex-nowrap p-0">
          <NavbarSearch />
          <NavbarNav />
        </Navbar>
      </Container>
    </div>
  );
};

export default MainNavbar;
