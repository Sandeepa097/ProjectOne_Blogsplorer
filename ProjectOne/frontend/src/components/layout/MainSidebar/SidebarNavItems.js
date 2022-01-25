import React, {useState, useEffect} from "react";
import { Nav } from "shards-react";

import SidebarNavItem from "./SidebarNavItem";
import { Store } from "../../../flux";

const SidebarNavItems = () => {
  const [state, setState] = useState({
    navItems: Store.getSidebarItems()
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
      navItems: Store.getSidebarItems()
    });
  }

  const { navItems: items } = state;
  return (
    <div className="nav-wrapper" style={{backgroundColor: "#304f7e"}}>
      <Nav className="nav--no-borders flex-column" style={{height: '100%'}}>
        {items.map((item, idx) => (
          <SidebarNavItem key={idx} item={item} />
        ))}
        <div className="m-auto" style={{height: "150px"}}>
            <img
              id="main-logo"
              className="d-inline-block align-bottom mr-0"
              style={{ maxWidth: "100%"}}
              src={require("../../../images/logo3.png")}
              alt="Blogsplorer"
            />
        </div>
      </Nav>
    </div>
  )
}

export default SidebarNavItems;
