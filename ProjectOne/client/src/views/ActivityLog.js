import React, {useState, useEffect} from "react";
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Log from "../services/activitylogs";

const ActivityLog = () => {
  const [count, setCount] = useState(1)
  const [logs, setLogs] = useState([])
  const [active, setActive] = useState({
    publications: true,
    draft: false,
    profile: false
  })

  useEffect(() => {
    let activated
    for(const item in active){
      if(active[item]){
        activated = item
        break;
      }
      continue;
    }

    Log.getLogs(activated, count).then(details => {
      setCount(details.count)
      setLogs([...details.data])
    })
  }, [active])

  const onChangeActive = (name) => {
    let activated
    for(const item in active){
      if(active[item]){
        activated = item
        break;
      }
      continue;
    }
    setActive({
      ...active,
      [activated]: false,
      [name]: true
    })
  }

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
            onClick = {() => onChangeActive("publications")}>
              Publications</Button>
          <Button 
            squared 
            outline = {active.draft}
            disabled = {active.draft}
            size="md" 
            theme="dark"
            onClick = {() => onChangeActive("draft")}>
              Draft</Button>
          <Button 
            squared 
            outline = {active.profile}
            disabled = {active.profile}
            size="md" 
            theme="dark"
            onClick = {() => onChangeActive("profile")}>
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
            {logs.reverse().map((item, idx) => (
              <ListGroupItem key={idx}>
                <h5>{item.date}</h5>
                <p>{item.title}</p>
                <Button pill outline size="sm" theme="secondary"><i className="material-icons" style={{fontSize: "18px"}}>delete_forever</i></Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )

}

export default ActivityLog;