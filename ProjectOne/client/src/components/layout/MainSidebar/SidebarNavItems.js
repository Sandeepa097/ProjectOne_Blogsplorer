import React, {useState, useEffect} from "react";
import { Nav } from "shards-react";

import SidebarNavItem from "./SidebarNavItem";
import Message from "../../../services/message";
import { Store, ChatStore, Dispatcher, Constants } from "../../../flux";

const SidebarNavItems = () => {
  const [newMsgCount, setNewMsgCount] = useState()
  const [state, setState] = useState({
    navItems: Store.getSidebarItems()
  })

  useEffect(() => {
    Store.addChangeListener(onChange)
    ChatStore.addChangeListener(setMsg)
    Message.getMessages().then(messages => {
      Dispatcher.dispatch({
        actionType: Constants.RECIEVE_MESSAGES,
        payload: messages.message
      })
    })

    return () => {
      ChatStore.removeChangeListener(setMsg)
      Store.removeChangeListener(onChange)
    }
  }, [])

  const onChange = () => {
    setState({
      ...state,
      navItems: Store.getSidebarItems()
    });
  }

  const setMsg = () => {
    setNewMsgCount(ChatStore.getMessages().new.length)
  }

  const { navItems: items } = state;
  return (
    <div className="nav-wrapper" style={{backgroundColor: "#304f7e"}}>
      <Nav className="nav--no-borders flex-column" style={{height: '100%'}}>
        {items.map((item, idx) => (
          <SidebarNavItem key={idx} item={item} count={newMsgCount} />
        ))}
        <div className="m-auto">
            <img
              id="main-logo"
              className="d-inline-block align-bottom mr-0"
              style={{ maxWidth: "100%"}}
              src={require("../../../images/logo2.png")}
              alt="Blogsplorer"
            />
        </div>
      </Nav>
    </div>
  )
}

export default SidebarNavItems;
