import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  CardBody,
  CardHeader,
  ButtonGroup,
  Button,
  Alert,
  Modal,
  ModalBody,
} from "shards-react";
import { confirm } from "react-confirm-box"
import EditPost from "./EditPost";
import PageTitle from "../components/common/PageTitle";
import Blog from "../services/blogs";
import LoadingIndicator from "../components/common/LoadingIndicator";
import Errors from "./Errors";
import { UserStore, Dispatcher, Constants } from "../flux";
import DOMPurify from "dompurify"

const Post = () => {
  const [loading, setLoading] = useState(true)
  const [blogRemoved, setBlogRemoved] = useState(false)
  const [error, setError] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [mine, setMine] = useState(false)
  const [blog, setBlog] = useState({})
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    theme: ""
  })
  let params = (new URL(document.location)).searchParams
  let edit = params.get("edit")
  let id = params.get("id")
  let ni = params.get("ni")

  useEffect(() => {
    setLoading(true)
    Blog.blog(id, ni).then(details => {
      if(details.error || !details){
        setError(true)
        return
      }
      setMine(details.author.id === UserStore.getUserDetails().id)
      setBlog({...details})
      setShowEdit(details.author.id === UserStore.getUserDetails().id && edit === "true")
      setLoading(false)
    })
  }, [id])

  const onClickDelete = async(id, ni) => {
    const conf = await confirm("Are you sure you want to delete?")
    if(conf){
      Dispatcher.dispatch({
        actionType: ni ? Constants.DELETE_BLOG_NO_IMAGE : Constants.DELETE_BLOG,
        payload: id
      })
      const response = await Blog.deleteBlog(id, ni)
      if(response.error){
        setAlertMessage({
          message: response.error,
          theme: "danger"
        })
        return null
      }
      setAlertMessage({
        message: "Post Deleted Successfully...",
        theme: "secondary"
      })
      setBlogRemoved(true)
    }
  }

  const onClickMove = async(id, ni) => {
    const conf = await confirm("Post will be unpublished after moving. Is it okay?")
    if(conf){
      Dispatcher.dispatch({
        actionType: ni ? Constants.DELETE_BLOG_NO_IMAGE : Constants.DELETE_BLOG,
        payload: id
      })
      const response = await Blog.moveToDraft(id, ni)
      if(response.error){
        setAlertMessage({
          message: response.error,
          theme: "danger"
        })
        return null
      }
      setAlertMessage({
        message: "Post is moved to your draft...",
        theme: "info"
      })
      setBlogRemoved(true)
    }
  }

  return (
    <Container fluid className="main-content-container px-4">
      {error && <Errors />}
      {!!alertMessage.message && <Alert theme= {alertMessage.theme} className="mb-0">
        <i className="fa fa-info mx-2"></i> {alertMessage.message}
      </Alert>}

      <Modal centered style={{overflowY: "auto"}} open={showEdit} toggle={() => setShowEdit(!showEdit)}>
        <ModalBody>
          <EditPost handleClose = {setShowEdit} 
              blog = {blog} 
              ni={ni} 
              setBlog = {setBlog}
              setAlert = {setAlertMessage}
            />
        </ModalBody>
      </Modal>

      {!error && !blogRemoved && <Container>
      {loading && <LoadingIndicator />}
        <Row noGutters className="page-header py-4">
          <PageTitle title={blog.title} subtitle={blog.category} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>

        <Row>
          <Col lg="12">
          {mine && <div className="blog-comments__actions" style={{float: 'right'}}>
                  <ButtonGroup size="sm">
                    <Button theme="white" onClick={() => setShowEdit(!showEdit)}>
                      <span className="text-success">
                        <i className="material-icons">edit</i>
                      </span>{" "}
                      Edit
                    </Button>
                    <Button theme="white" onClick={(e) => {onClickMove(blog.id, !blog.backgroundImage)}}>
                      <span className="text-dark">
                        <i className="material-icons">block</i>
                      </span>{" "}
                      Move to Draft
                    </Button>
                    <Button theme="white" onClick={(e) => {onClickDelete(blog.id, !blog.backgroundImage)}}>
                      <span className="text-danger">
                        <i className="material-icons">delete</i>
                      </span>{" "}
                      Delete
                    </Button>
                  </ButtonGroup>
                </div>}
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            {!loading && <Card small className="mb-4 pt-3" style={{minHeight: "600px"}}>
              <CardHeader>
                <div className="card-post__author d-flex">
                  <Link
                    to={`/user?id=${blog.author.id}`}
                    className="card-post__author-avatar card-post__author-avatar"
                    style={{ backgroundImage: `url('${blog.author.authorAvatar}')` }}
                  >
                    Written by {blog.author.firstName}
                  </Link>
                  <div className="d-flex flex-column justify-content-center ml-3">
                    <span className="card-post__author-name">
                      {blog.author.firstName} {blog.author.lastName}
                    </span>
                    <small className="text-muted">{blog.date}</small>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="border-top">
                <div className="mb-3 mx-auto" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(blog.body)}}>
                </div>
                <div className="mb-3 mx-auto">
                  <img
                    src={!!blog.backgroundImage ? blog.backgroundImage : null}
                    alt={!!blog.backgroundImage ? blog.id  : null}
                    width="50%"
                  />
                </div>
              </CardBody>

            </Card>}
          </Col>
        </Row>
      </Container>}
    </Container>
  )
}

export default Post;