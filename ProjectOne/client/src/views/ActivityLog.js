import React, {useState, useEffect} from "react";
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from "shards-react";
import LoadingIndicator from "../components/common/LoadingIndicator"
import PageTitle from "../components/common/PageTitle";
import Log from "../services/activitylogs";

const ActivityLog = () => {
  const [loading, setLoading] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState([])
  const [active, setActive] = useState({
    publications: true,
    draft: false,
    profile: false
  })

  const findActivated = () => {
    let activated = ""
    for(const item in active){
      if(active[item]){
        activated = item
        break;
      }
      continue;
    }
    return activated
  }

  useEffect(() => {
    setLoading(true)
    let activated = findActivated()
    console.log("pagenumber", pageNum)
    Log.getLogs(activated, pageNum).then(details => {
      console.log(activated, details)
      setCount(details.count)
      setLogs([...details.data])
      setLoading(false)
    })
  }, [active, pageNum])

  const onChangeActive = (name) => {
    let activated = findActivated()
    setActive({
      ...active,
      [activated]: false,
      [name]: true
    })
  }

  const clearLog = async() => {
    let activated = findActivated()
    setLogs([])
    await Log.deleteLog(activated)
  }

  const deleteById = async(id) => {
    let activated = findActivated()
    setLogs(logs.filter(item => item._id !== id))
    await Log.deleteById(activated, id)
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Activity Log" subtitle="Profile" className="text-sm-left" />
      </Row>
      <Row>
        <Col lg="6">
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
        </Col>
        <Col lg="6">
          <Button style={{float: "right"}}
            pill 
            outline
            size="md" 
            theme="danger"
            onClick={() => clearLog()}>
              Clear Log</Button>
        </Col>
      </Row>
      <Row style={{paddingTop: "10px", paddingBottom: "10px"}}>
        <Col lg="12">
          <ListGroup>
            {loading && <LoadingIndicator />}
            {!logs.length && <ListGroupItem>
              No any records..
            </ListGroupItem>}
            {!loading && logs.reverse().map((item, idx) => (
              <ListGroupItem key={idx}>
                <h5>{item.date}</h5>
                <p>{item.title}</p>
                <Button pill outline size="sm" theme="secondary" onClick={() => deleteById(item._id)}><i className="material-icons" style={{fontSize: "18px"}}>delete_forever</i></Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col lg="4"><Button theme="secondary" disabled={pageNum === 1} onClick={() => setPageNum(pageNum-1)}><i className="material-icons">arrow_back</i>Prev</Button></Col>
        <Col lg="4" style={{textAlign: "center"}}><span style={{fontSize: "14pt"}}>{pageNum}</span></Col>
        <Col lg="4"><Button theme="secondary" disabled={pageNum * 10 >= count} style={{float: "right"}} onClick={() => setPageNum(pageNum+1)}>Next<i className="material-icons">arrow_forward</i></Button></Col>
      </Row>
    </Container>
  )

}

export default ActivityLog;