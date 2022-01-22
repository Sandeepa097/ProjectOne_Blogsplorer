import React from 'react'
import { Container, Col, Row } from 'shards-react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'

const Auth = () => {
    return (
        <Container>
        <Row>
          <Col lg="6">
            <Login />
          </Col>
          <Col lg="6">
            <Register />
          </Col>
        </Row>
      </Container>
    )
}

export default Auth
