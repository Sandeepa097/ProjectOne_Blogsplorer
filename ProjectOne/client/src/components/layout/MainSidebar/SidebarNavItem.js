import React from "react";
import { NavItem, NavLink } from "shards-react";

const SidebarNavItem = ({ item }) => (
  <NavItem>
    <NavLink href={item.to}>
      {item.htmlBefore && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
        />
      )}
      {item.title && <span style={{color: "#c1a53a"}}>{item.title}</span>}
      {item.htmlAfter && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
        />
      )}
    </NavLink>
  </NavItem>
);

export default SidebarNavItem;
