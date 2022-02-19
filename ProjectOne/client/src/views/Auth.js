import React, {useState} from 'react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'
import { Row, Col } from 'shards-react'

const Auth = () => {
    const [toggle, setToggle] = useState(true)

    return (
      <Row>
        <Col lg="6" md="6" sm="6" style={{display: "flex", justifyContent: "center"}}>
          <div style={{boxSizing: "border-content", display: "flex", justifyContent: "center", height: "50vw", width: "50vw"}}>
          <img
            style={{maxHeight: "100%"}}
            src={require("../images/logo2.png")}
            alt="Blogsplorer"
          />
          </div>
        </Col>
        <Col lg={{ size: "4" }} md="6" sm="6" style={{display: "flex", justifyContent: "center"}}>
          {toggle && <Login setForm = {setToggle} />}
          {!toggle && <Register setForm = {setToggle} />}
        </Col>
      </Row>
    )
}

export default Auth
