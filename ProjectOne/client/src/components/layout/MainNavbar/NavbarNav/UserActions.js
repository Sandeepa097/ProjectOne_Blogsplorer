import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,

} from "shards-react";
import User from '../../../../services/users'
import { UserStore, Dispatcher, Constants } from "../../../../flux"

const UserActions = () => {
  const [visible, setVisible] = useState(false)
  const [userDetails, setUserDetails] = useState({
    id: UserStore.getUserDetails().id,
    name: UserStore.getUserDetails().fullName,
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
      name: details.fullName,
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
      <DropdownToggle caret className="text-nowrap px-3" theme="light">
        <a href={"/user?id=" + userDetails.id} style={{textDecoration: 'none'}}>{userDetails.userAvatar && <img
          className="user-avatar rounded-circle mr-2"
          src={userDetails.userAvatar}
          alt={userDetails.fullName}
        />}
        {!userDetails.userAvatar && <i className="material-icons" style={{fontSize: "2.5rem", verticalAlign: "middle"}}>account_circle</i>}{" "}</a>
        <span className="d-none d-md-inline-block">{userDetails.name}</span>
      </DropdownToggle>
      <Collapse tag={DropdownMenu} right small open={visible}>
        <Link to={"/user?id=" + userDetails.id} style={{textDecoration: 'none'}}>
        <DropdownItem>
          <i className="material-icons">&#xE7FD;</i> Profile
        </DropdownItem>
        </Link>
        <Link to="user-profile" style={{textDecoration: 'none'}}>
        <DropdownItem>
          <i className="material-icons">&#xE8B8;</i> Edit Profile
        </DropdownItem>
        </Link>
        <DropdownItem divider />
        <Link to="register" style={{textDecoration: 'none'}}>
        <DropdownItem className="text-danger" onClick = {onClickLogout}>
          <i className="material-icons text-danger">&#xE879;</i> Logout
        </DropdownItem>
        </Link>
    </Collapse>
    </NavItem>
    );
  }


export default UserActions;
