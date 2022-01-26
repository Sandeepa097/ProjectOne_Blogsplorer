import React from "react";
import { Container, Button } from "shards-react";

const Errors = () => {
  return(
    <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>404</h2>
        <h3>Page not found!</h3>
        <p>The page you are looking for doesn't exist or another error occurred.</p>
        <Button pill onClick={e => window.history.back()}>&larr; Go Back</Button>
      </div>
    </div>
  </Container>
  )
};

export default Errors;