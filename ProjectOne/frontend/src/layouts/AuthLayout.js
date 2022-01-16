import React from 'react'
import { Container, Row, Col } from 'shards-react'

const AuthLayout = ({children}) => {
    return (
        <Container>
            <Row>
                <Col  className="main-content p-0"
                    lg={{ size: 10, offset: 1}}
                    md={{ size: 9, offset: 3 }}
                    sm="12"
                    tag="main"
                >
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default AuthLayout
