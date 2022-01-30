import React, {useState} from "react";
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from "shards-react";
import PageTitle from "../components/common/PageTitle";

const ActivityLog = () => {
  const [active, setActive] = useState({
    publications: true,
    draft: false,
    profile: false
  })

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Activity Log" subtitle="Profile" className="text-sm-left" />
      </Row>
      <Row>
        <Col>
          <Button 
            squared 
            outline = {active.publications}
            disabled = {active.publications}
            size="md" 
            theme="dark"
            onClick = {() => setActive({...active, publications: true, draft: false, profile: false})}>
              Publications</Button>
          <Button 
            squared 
            outline = {active.draft}
            disabled = {active.draft}
            size="md" 
            theme="dark"
            onClick = {() => setActive({...active, publications: false, draft: true, profile: false})}>
              Draft</Button>
          <Button 
            squared 
            outline = {active.profile}
            disabled = {active.profile}
            size="md" 
            theme="dark"
            onClick = {() => setActive({...active, publications: false, draft: false, profile: true})}>
              Profile</Button>
          <span style={{paddingLeft: "15px"}}>
          <Button 
            pill 
            outline
            size="md" 
            theme="danger">
              Clear Log</Button></span>
        </Col>
      </Row>
      <Row style={{paddingTop: "10px", paddingBottom: "10px"}}>
        <Col>
          <ListGroup>
            <ListGroupItem>
              <h5>12 Oct, 2021</h5>
              <p>Cras justo odio</p>
              <Button pill outline size="sm" theme="secondary"><i className="material-icons" style={{fontSize: "18px"}}>delete_forever</i></Button>
            </ListGroupItem>
            <ListGroupItem>
              <h5>15 Dec, 2021</h5>
              <p>Dapibus ac facilisis in</p>
              <Button pill outline size="sm" theme="secondary"><i className="material-icons" style={{fontSize: "18px"}}>delete_forever</i></Button>
            </ListGroupItem>
            <ListGroupItem>
              <h5>16 Jan, 2022</h5>
              <p>Porta ac consectetur ac</p>
              <Button pill outline size="sm" theme="secondary"><i className="material-icons" style={{fontSize: "18px"}}>delete_forever</i></Button>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )

}

export default ActivityLog;