/* eslint jsx-a11y/anchor-is-valid: 0 */

import Blog from '../../services/blogs'
import React, {useState} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  Alert
} from "shards-react";
import { Dispatcher, Constants } from '../../flux';

const SidebarActions = ({ post }) => {
  const title = "Actions"

  const dateForamat = {year: 'numeric', month: 'long', day: 'numeric'}
  const today = new Date().toLocaleDateString("en-US", dateForamat)
  const[visibility] = useState('Private')
  const [status, setStatus] = useState(post._id ? "Edit Draft" : "New Post")
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    theme: ""
  })

  const fileReader = async() => {
    const promise = new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(post.backgroundImage)
    })
    return await promise
  }

  const setAlertAndTimeOut= (message, theme, time) => {
    setAlertMessage({
      message: message,
      theme: theme
    })
    if(time) {
      setTimeout(() => {
        setAlertMessage({
          message: "",
          theme: ""
        })
      }, time)
    }
  }
  
  const saveDraft = async()=> {
    let response
    setAlertAndTimeOut("Processing...", "secondary", 0)
    if(!post.backgroundImage){
      response = await Blog.addNewPostDraft({...post, date: today})
    }
    else if("string" === typeof post.backgroundImage){
      response = await Blog.addNewPostDraft({...post, alreadyAdded: post.backgroundImage, date: today})
    }
    else {
      const base64 = await fileReader()
      response = await Blog.addNewPostDraft({...post, backgroundImage: base64, date: today})
    }

    if(response.error) {
      setAlertAndTimeOut(response.error, "danger", 5000)
      return null
    }

    if(post._id) {
      Dispatcher.dispatch({
        actionType: Constants.DELETE_DRAFT,
        payload: {id: post._id}
      })
      await Blog.deletePostDraft(post._id)
    }

    Dispatcher.dispatch({
      actionType: Constants.RESET_POST,
      payload: ""
    })
    setStatus("New Post")
    setAlertAndTimeOut("Post is in draft now..", "info", 5000)
  }

  const onPublish = async() => {
    let response
    setAlertAndTimeOut("Processing...", "secondary", 0)
    if(!post.backgroundImage){
      response = await Blog.newPostPublished({...post, date: today})
    }
    else {
      const base64 = await fileReader()
      response = await Blog.newPostPublished({...post, backgroundImage: base64, date: today})
    }

    if(response.error) {
      setAlertAndTimeOut(response.error, "danger", 5000)
      return null
    }

    Dispatcher.dispatch({
      actionType: Constants.RESET_POST,
      payload: ""
    })
    setAlertAndTimeOut("Post is now published..", "success", 5000)
  }


  return(
    <div>
    <Card small className="mb-3">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>

    <CardBody className="p-0">
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <span className="d-flex mb-2">
            <i className="material-icons mr-1">flag</i>
            <strong className="mr-1">Status:</strong>  {" "}
            <span className="ml-auto" style={{color: `${status === "New Post" ? 'blue' : 'brown'}`}}>
              {status}
            </span>
          </span>
          <span className="d-flex mb-2">
            <i className="material-icons mr-1">visibility</i>
            <strong className="mr-1">Visibility:</strong>{" "}
            <span className="ml-auto" style={{color: "green"}}>
              {visibility}
            </span>
          </span>
          <span className="d-flex mb-2">
            <i className="material-icons mr-1">calendar_today</i>
            <strong className="mr-1">Date:</strong>{" "}
            <strong className="text-info ml-auto">{today}</strong>
          </span>
          <span className="d-flex">
            <i className="material-icons mr-1">score</i>
            <strong className="mr-1">Readability:</strong>{" "}
            <strong className="text-warning">Ok</strong>
          </span>
        </ListGroupItem>
        <ListGroupItem className="d-flex px-3 border-0">
          <Button outline theme="accent" size="sm" onClick={e=> saveDraft()} >
            <i className="material-icons">save</i> Save Draft
          </Button>
          <Button theme="accent" size="sm" className="ml-auto" onClick={e=> onPublish()} >
            <i className="material-icons">file_copy</i> Publish
          </Button>
        </ListGroupItem>
      </ListGroup>   
    </CardBody>
    </Card>
    {!!alertMessage.message && <Alert theme= {alertMessage.theme} className="mb-0">
      <i className="fa fa-info mx-2"></i> {alertMessage.message}
    </Alert>}
    </div>
  )
};

export default SidebarActions;
