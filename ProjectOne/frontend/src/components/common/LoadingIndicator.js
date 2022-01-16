import React from 'react'
import Loader from 'react-loader-spinner'

const LoadingIndicator = () => {
    return (
        <div
            style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "inline",
                alignContent: "block"
            }}
        >
            <Loader type="BallTriangle" height="100" width= "100" />
        </div>
    )
}

export default LoadingIndicator
