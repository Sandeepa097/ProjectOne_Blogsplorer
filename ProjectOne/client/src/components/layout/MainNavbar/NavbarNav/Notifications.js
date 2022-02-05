import React, {useState, useEffect} from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";
import { NotificationsStore, Constants, Dispatcher } from "../../../../flux";

const Notifications = () => {
  const [visible, setVisible] = useState(false)
  const [countNow, setCountNow] = useState(NotificationsStore.getCount())
  const [notifications, setNotifications] = useState(NotificationsStore.getNotifications())

  const toggleNotifications =() => {
    setCountNow(0)
    setVisible(!visible)
    Dispatcher.dispatch({
      actionType: Constants.SETCOUNT_NOTIFY,
      payload: 0
    })
  }

  useEffect(() => {
    NotificationsStore.addChangeListener(setDetails)

    return () => NotificationsStore.removeChangeListener(setDetails)
  })

  const setDetails = () => {
    setCountNow(countNow+1)
    setNotifications([...NotificationsStore.getNotifications()])
  }

  console.log("invoked again Notification")

  return (
    <NavItem className="border-right dropdown notifications">
    <NavLink
      className="nav-link-icon text-center"
      onClick={toggleNotifications}
    >
      <div className="nav-link-icon__wrapper">
        <i className="material-icons">&#xE7F4;</i>
        {!!countNow && <Badge pill theme="danger">
          {countNow}
        </Badge>}
      </div>
    </NavLink>
    <Collapse
      open={visible}
      className="dropdown-menu dropdown-menu-small"
    >
      {notifications.map((item, idx) => (
        <DropdownItem key={idx} href={item.postURL}>
          <div className="notification__icon-wrapper">
            <div>
              {!!item.authorAvatar && <img src = {item.authorAvatar} style={{width: "2.1875rem"}} />}
              {!item.authorAvatar && <i className="material-icons" style={{fontSize: "2.1875rem"}}>account_box</i>}
            </div>
          </div>
          <div className="notification__content">
            <span className="notification__category">{item.categType}</span>
            <p>
              {item.authorName}{" "}
                {item.categType === 'New Post' ? 'published a new post... ' : 'edited their post... '}
                <span className="text-success text-semibold">"{item.title}"</span>
            </p>
          </div>
        </DropdownItem>
      ))}
      {/*<DropdownItem className="notification__all text-center">
        View all Notifications
      </DropdownItem>*/}
      {!notifications.length && <span className="notification__all text-center" style={{color: "brown", fontSize: "11pt"}}>
        Empty...
      </span>}
    </Collapse>
  </NavItem>
  )
}

export default Notifications