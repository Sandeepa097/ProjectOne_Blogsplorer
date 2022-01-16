import React from 'react'
import { Container, Col, Row } from 'shards-react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'

const auth = () => {
    return (
        <Container fluid className="main-content-container px-4 pb-4">
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

export default auth
