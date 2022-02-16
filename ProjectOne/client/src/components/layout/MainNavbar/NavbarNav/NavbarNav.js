import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import SocketContext from "../../../../websocket/socketContext"

export default () => (
  <Nav navbar className="border-left flex-row">
    <Notifications />
    <SocketContext.Consumer>
      {socket => <UserActions socket={socket} />}
    </SocketContext.Consumer>
  </Nav>
);
