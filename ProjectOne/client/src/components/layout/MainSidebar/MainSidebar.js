import React, {useState, useEffect} from "react";
import classNames from "classnames";
import { Col } from "shards-react";

import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarNavItems from "./SidebarNavItems";

import { Store } from "../../../flux";

const MainSidebar = () => {
  const [state, setState] = useState({
    menuVisible: Store.getMenuState(),
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
    "col-2",
    "open"
  )

  return (
    <Col
      tag="aside"
      className={classes}
      style={{height: "auto", zIndex: "10"}}
      lg={{ size: 2 }}
      md={{ size: 2 }}
      sm={{ size: 2 }}
    >
      <SidebarMainNavbar />
      {state.menuVisible &&<SidebarNavItems />}
    </Col>
  )
}

export default MainSidebar;
