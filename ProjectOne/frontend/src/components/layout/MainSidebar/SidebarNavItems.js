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
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column">
        {items.map((item, idx) => (
          <SidebarNavItem key={idx} item={item} />
        ))}
      </Nav>
    </div>
  )
}

export default SidebarNavItems;
