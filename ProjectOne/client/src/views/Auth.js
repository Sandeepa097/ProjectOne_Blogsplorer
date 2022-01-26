import React, {useState} from 'react'
import { Container, Col, Row } from 'shards-react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'

const Auth = () => {
    const [toggle, setToggle] = useState(true)

    return (
      <div>
        <div style={{width: "50%", float: 'left'}}>
          <img
            id="main-logo"
            className="d-inline-block align-top mr-0"
            style={{ maxHeight: "600px"}}
            src={require("../images/logo1.jpg")}
            alt="Blogsplorer"
          />
        </div>
        <div style={{width: "50%", float: 'right'}}>
          {toggle && <Login setForm = {setToggle} />}
          {!toggle && <Register setForm = {setToggle} />}
        </div>
      </div>
    )
}

export default Auth
