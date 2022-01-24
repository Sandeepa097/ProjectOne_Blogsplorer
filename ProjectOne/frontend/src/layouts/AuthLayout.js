import React from 'react'
import { Container, Row, Col } from 'shards-react'
import "../assets/authlayout.css"

const AuthLayout = ({children}) => {
    return (
        <div className="containerElement" >
            {children}
        </div>
    )
}

export default AuthLayout