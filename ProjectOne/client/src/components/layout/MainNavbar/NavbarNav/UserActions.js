import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";
import User from '../../../../services/users'
import { UserStore, Dispatcher, Constants } from "../../../../flux"

const UserActions = () => {
  const [visible, setVisible] = useState(false)
  const [userDetails, setUserDetails] = useState({
    id: UserStore.getUserDetails().id,
    name: UserStore.getUserDetails().firstName + ' ' + UserStore.getUserDetails().lastName,
    userAvatar: UserStore.getUserDetails().authorAvatar
  })

  useEffect(() => {
    UserStore.addChangeListener(setDetails)
    User.userDetails().then(details => {
      Dispatcher.dispatch({
        actionType: Constants.RECIEVE_USER,
        payload: details
      })
    })

    return () => {
      UserStore.removeChangeListener(setDetails)
    }
  }, [])

  const toggleUserActions = () => {
    setVisible(!visible)
  }

  const setDetails = () => {
    const details = UserStore.getUserDetails()
    setUserDetails({
      id: UserStore.getUserDetails().id,
      name: details.firstName + ' ' + details.lastName,
      userAvatar: details.authorAvatar
    })
  }

  const onClickLogout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("userId")
    Dispatcher.dispatch({
      actionType: Constants.USER_LOGOUT,
      payload: ""
    })
  }

  return (
    <NavItem tag={Dropdown} caret toggle={toggleUserActions}>
      <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
        <a href={"/user?id=" + userDetails.id}><img
          className="user-avatar rounded-circle mr-2"
          src={userDetails.userAvatar ? userDetails.userAvatar : null}
          alt={userDetails.userAvatar ? "User Avatar" : null}
        />{" "}</a>
        <span className="d-none d-md-inline-block">{userDetails.name}</span>
      </DropdownToggle>
      <Collapse tag={DropdownMenu} right small open={visible}>
        <DropdownItem tag={Link} to={"/user?id=" + userDetails.id}>
          <i className="material-icons">&#xE7FD;</i> Profile
        </DropdownItem>
        <DropdownItem tag={Link} to="user-profile">
          <i className="material-icons">&#xE8B8;</i> Edit Profile
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="register" className="text-danger" onClick = {onClickLogout}>
          <i className="material-icons text-danger">&#xE879;</i> Logout
        </DropdownItem>
  </Collapse>
    </NavItem>
    );
  }


export default UserActions;
