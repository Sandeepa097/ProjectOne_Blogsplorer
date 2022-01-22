/* eslint jsx-a11y/anchor-is-valid: 0 */

import Blog from '../../services/blogs'
import { Link } from "react-router-dom";
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
  const [alertMessage, setAlertMessage] = useState({
    message: '',
    theme: ''
  })

  const dateForamat = {year: 'numeric', month: 'long', day: 'numeric'}
  const today = new Date().toLocaleDateString("en-US", dateForamat)
  const[visibility, setVisibility] = useState('Public')
  const [status, setStatus] = useState('Draft')

  const onClickDelete = (e) => {
    console.log('deleted')
  }
  
  const saveDraft = async()=> {
    if(!post.backgroundImage){
      Blog.addNewPostDraft({...post, date: today})
    }
    else if("string" === typeof post.backgroundImage){
      Blog.addNewPostDraft({...post, alreadyAdded: post.backgroundImage, date: today})
    }
    else {
      const reader = new FileReader()
      reader.readAsDataURL(post.backgroundImage)
      reader.onloadend = () => {
        Blog.addNewPostDraft({...post, backgroundImage: reader.result, date: today})
      }
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

    setAlertMessage({
      message: "Post is in draft now..",
      color: "info"
    })

    setTimeout(() => {
      setAlertMessage({
        message: "",
        color: ""
      })
    }, 3000)
  }

  const onPublish = () => {
    if(!post.backgroundImage){
      Blog.newPostPublished({...post, date: today})
    }
    else {
      const reader = new FileReader()
      reader.readAsDataURL(post.backgroundImage)
      reader.onloadend = () => {
        Blog.newPostPublished({...post, backgroundImage: reader.result, date: today})
      }
    }

    Dispatcher.dispatch({
      actionType: Constants.RESET_POST,
      payload: ""
    })

    setAlertMessage({
      message: "Post is now published..",
      color: "success"
    })

    setTimeout(() => {
      setAlertMessage({
        message: "",
        color: ""
      })
    }, 3000)
  }


  return(
    <div>
    {!!alertMessage.message && <Alert theme= {alertMessage.theme} className="mb-0">
      <i className="fa fa-info mx-2"></i> {alertMessage.message}
    </Alert>}
    <Card small className="mb-3">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>

    <CardBody className="p-0">
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <span className="d-flex mb-2">
            <i className="material-icons mr-1">flag</i>
            <strong className="mr-1">Status:</strong> {status}{" "}
            <a className="ml-auto" href="#" onClick={e => onClickDelete(e)}>
              Delete
            </a>
          </span>
          <span className="d-flex mb-2">
            <i className="material-icons mr-1">visibility</i>
            <strong className="mr-1">Visibility:</strong>{" "}
            <strong className="text-success">{visibility}</strong>{" "}
            <a className="ml-auto" href="#" onClick={e => setVisibility(visibility === 'Public' ? 'Private' : 'Public')}>
              Change
            </a>
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
          <Button outline to="dashboard" theme="accent" size="sm" onClick={e=> saveDraft()} >
            <i className="material-icons">save</i> Save Draft
          </Button>
          <Button to="blog-posts" theme="accent" size="sm" className="ml-auto" onClick={e=> onPublish()} >
            <i className="material-icons">file_copy</i> Publish
          </Button>
        </ListGroupItem>
      </ListGroup>   
    </CardBody>
    </Card>
    </div>
  )
};

export default SidebarActions;
