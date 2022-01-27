import React, {useEffect, useState} from "react";
import { Card, CardBody, Container, Form, FormInput, Row, Button, Col } from "shards-react";
import ReactQuill from "react-quill";
import Blog from "../services/blogs";

import "react-quill/dist/quill.snow.css";
import "../assets/quillEditPost.css"

const EditPost = ({handleClose, blog, ni, setBlog, setAlert}) => {
    const [content, setContent] = useState({
        title: blog.title,
        body: blog.body
    })

    useEffect(() => {

    }, [content])

    const onChangeTitle = (text) => {
        setContent({...content, title: text})
    }

    const onChangeBody = (html) => {
        setContent({...content, body: html})
    }

    const onClickDone = async(event) => {
        event.preventDefault()
        let post = content
        if(!content.title){
            post.title = blog.title
        }
        const response = await Blog.editBlog(blog.id, ni, post)
        if(response.error){
            handleClose(false)
            setAlert({
                message: response.error,
                theme: "danger"
              })
            setTimeout(() => {
                setAlert({
                  message: "",
                  theme: ""
                })
              }, 5000)
            return null
        }

        setBlog({...blog, title: post.title, body: post.body})
        handleClose(false)
        setAlert({
            message: "Post is edited successfully..",
            theme: "success"
          })
        setTimeout(() => {
            setAlert({
              message: "",
              theme: ""
            })
          }, 5000)
    }

    return (
        <Container>
            <Row>
                <Card small className="mb-3">
                    <CardBody>
                        <Form>
                            <FormInput size="lg" 
                                value={content.title}
                                onChange = {(e) => onChangeTitle(e.target.value)}
                            />
                            <ReactQuill className="edit-post__editor"
                                value = {content.body}
                                modules= {{
                                toolbar: {
                                    container: [
                                        [{'header': [1, 2, 3, false]}],
                                        ['bold', 'italic', 'underline'],
                                        [{'list': 'ordered'}, {'list': 'bullet'}],
                                        [{'align': ''}, {'align': 'right'}, {'align': 'center'}, {'align': 'justify'}],
                                        [{'color': []}]
                                        ]
                                    }
                                }} 
                                onChange={onChangeBody}
                            />
                        </Form>
                    </CardBody>
                </Card>
            </Row>
            <Row>
                <Col lg="6">
                    <Button outline theme="dark" size="sm" onClick={() => handleClose(false)}>
                        <i className="material-icons">clear</i> Cancel
                    </Button>
                </Col>
                <Col lg="6">
                    <Button theme="warning" size="sm" style={{float: 'right'}} onClick={(e) => onClickDone(e)}>
                        <i className="material-icons">check</i> Done
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default EditPost;