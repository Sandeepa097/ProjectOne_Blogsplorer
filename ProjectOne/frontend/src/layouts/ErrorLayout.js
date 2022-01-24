import React from 'react'
import { Container, Row, Col } from 'shards-react'

const ErrorLayout = ({children}) => {
    return (
        <Container fluid className="main-content-container px-4 pb-4 py-5">
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

export default ErrorLayout;
