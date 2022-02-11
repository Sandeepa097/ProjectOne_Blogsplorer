// eslint-disable
import React from "react";
import { Link } from "react-router-dom";
import { Badge, NavItem } from "shards-react";

const SidebarNavItem = ({ item, count }) => (
  <NavItem active={(window.location.pathname === item.to)}>
    <Link to={item.to} style={{textDecoration: "none"}}>
    <div className="nav-link">
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
      {item.title === "Messages" && !!count && <Badge pill theme="danger" style={{float: "right"}}>
        {count}
      </Badge>}
    </div> 
    </Link>
  </NavItem>
);

export default SidebarNavItem;
