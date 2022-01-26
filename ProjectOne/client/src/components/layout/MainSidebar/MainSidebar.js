import React, {useState, useEffect} from "react";
import classNames from "classnames";
import { Col } from "shards-react";

import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarSearch from "./SidebarSearch";
import SidebarNavItems from "./SidebarNavItems";

import { Store } from "../../../flux";

const MainSidebar = () => {
  const [state, setState] = useState({
    menuVisible: false,
    sidebarNavItems: Store.getSidebarItems()
  })

  useEffect(() => {
    Store.addChangeListener(onChange)
    return () => {
      Store.removeChangeListener(onChange)
    }
  }, [])

  const onChange = () => {
    setState({
      ...state,
      menuVisible: Store.getMenuState(),
      sidebarNavItems: Store.getSidebarItems()
    })
  }

  const classes = classNames(
    "main-sidebar",
    "px-0",
    "col-12",
    state.menuVisible && "open"
  )

  return (
    <Col
      tag="aside"
      className={classes}
      lg={{ size: 2 }}
      md={{ size: 3 }}
    >
      <SidebarMainNavbar />
      <SidebarSearch />
      <SidebarNavItems />
    </Col>
  )
}

export default MainSidebar;
