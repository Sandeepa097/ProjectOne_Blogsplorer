import React from 'react'
import { Container, Col, Row } from 'shards-react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'

const Auth = () => {
    return (
      <div>
        <div style={{width: "50%", float: 'left'}}>
          <Login />
        </div>
        <div style={{width: "50%", float: 'left'}}>
          <Register />
        </div>
      </div>
    )
}

export default Auth
