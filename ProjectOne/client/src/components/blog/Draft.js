import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
  Button,
  Row,
  Col,
} from "shards-react";
import { Link } from "react-router-dom";
import { confirm } from "react-confirm-box"
import Blog from "../../services/blogs";
import LoadingIndicator from "../common/LoadingIndicator";
import { UserStore, Dispatcher, Constants } from "../../flux";

const Draft = ({draftCount, publishCount}) => {
  const title = "Your Draft"

  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState([...UserStore.getUserDetails().draft.slice().reverse()])
  const [draftLength, setDraftLength] = useState(UserStore.getUserDetails().draft.length)
  const [count, setCount] = useState(3)
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    color: "green"
  })

  const setAlertAndTimeOut= (message, color, time) => {
    setAlertMessage({
      message: message,
      color: color
    })
    if(time) {
      setTimeout(() => {
        setAlertMessage({
          message: "",
          color: "green"
        })
      }, time)
    }
  }

  useEffect(() => {
    setLoading(true)
    UserStore.addChangeListener(setDetails)
    setLoading(false)

    return() => {
      UserStore.removeChangeListener(setDetails)
    }
  }, [])

  const setDetails = () => {
    setDraftLength(UserStore.getUserDetails().draft.length)
    setDrafts([...UserStore.getUserDetails().draft.slice().reverse()])
  }

  const viewAll = () => {
    setCount(draftLength)
  }

  const seeLess = () => {
    setCount(3)
  }
 
  const deletePost = async(id) => {
    const conf = await confirm("Are you sure you want to delete?")
    if(conf) {
      setAlertAndTimeOut("processing.. Please wait..", "blue", 0)
      const response = await Blog.deletePostDraft(id)
      if(response.error) {
        setAlertAndTimeOut(response.error, "red", 5000)
        return null
      }

      Dispatcher.dispatch({
        actionType: Constants.DELETE_DRAFT,
        payload: {id: id}
      })
      if(count !== 3) {
        setCount(count - 1)
      }

      draftCount(-1)
      setAlertAndTimeOut("Post deleted successfully..", "gray", 5000)
    }
  }

  const publishPost = async(id) => {
    setAlertAndTimeOut("processing.. Please wait..", "blue", 5000)
    const response = await Blog.publishPostFromDraft(id)
    if(response.error) {
      setAlertAndTimeOut(response.error, "red", 5000)
      return null
    }

    Dispatcher.dispatch({
      actionType: Constants.PUBLISH_DRAFT,
      payload: {id: id, reset: false}
    })
    if(count !== 3) {
      setCount(count - 1)
    }

    draftCount(-1)
    publishCount(1)
    setAlertAndTimeOut("Post is now published..", "green", 5000)
  }

  const editDraft = (id) => {
    const post = UserStore.editDraft(id)
    Dispatcher.dispatch({
      actionType: Constants.EDIT_POST,
      payload: post
    })
  }

  return(
    <Card small className="blog-comments">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <CardBody className="p-0">
      {drafts.slice(0, count).map((draft, idx) => (
        <div key={idx} className="blog-comments__item d-flex p-3">
          {/* Avatar */}
          <div className="blog-comments__avatar mr-3">
            <img src={draft.backgroundImage ? draft.backgroundImage : null} alt={draft.backgroundImage ? draft.title.substring(0, 5) : null} />
          </div>

          {/* Content */}
          <div className="blog-comments__content">
            {/* Content :: Title */}
            <div className="blog-comments__meta text-mutes">
                {draft.title} - {draft.date}
            </div>

            {/* Content :: Body */}
            <p className="m-0 my-1 mb-2 text-muted">{draft.body.slice(0, 100).toString().replace(/<\/?[^>]+(>|$)/g, "") + '...'}</p>

            {/* Content :: Actions */}
            <div className="blog-comments__actions">
              <ButtonGroup size="sm">
                <Button theme="white" onClick = {e=> publishPost(draft._id)}>
                  <span className="text-success">
                    <i className="material-icons">publish</i>
                  </span>{" "}
                  Publish
                </Button>
                <Button theme="white" onClick={e=> deletePost(draft._id)}>
                  <span className="text-danger">
                    <i className="material-icons">delete</i>
                  </span>{" "}
                  Delete
                </Button>
                <Link to="add-new-post" style={{textDecoration: 'none'}}>
                <Button to="add-new-post" theme="white" onClick={e=> editDraft(draft._id)}>
                  <span className="text-light">
                    <i className="material-icons">edit</i>
                  </span>{" "}
                  Edit
                </Button>
                </Link>
              </ButtonGroup>
            </div>
          </div>
        </div>
      ))}
    </CardBody>
    <CardFooter className="border-top">
      <Row>
        <Col className="text-center view-report">
          <div style={{width: "80px", margin: "auto"}}>{loading && <LoadingIndicator />}</div>
          {count < draftLength && !loading && <Button theme="white" onClick={e => viewAll()}>
            View All
          </Button>}
          {draftLength > 3 && count === draftLength && <Button theme="white" onClick={e => seeLess()}>
            See Less
          </Button>}
          {!draftLength && <div>Draft is empty...</div>}
          <span style={{"color": `${alertMessage.color}`}}>{alertMessage.message}</span>
        </Col>
      </Row>
    </CardFooter>
  </Card>
  )

};

export default Draft;
