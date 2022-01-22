import React from 'react'
import { Container, Row, Col } from 'shards-react'

const AuthLayout = ({children}) => {
    return (
        <Container fluid className="main-content-container px-4 pb-4 py-5" style={{width:"60%", height: "500px", margin: "0 auto", backgroundColor: "#FFA500"}}>
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
