import React, {useState, useEffect} from "react";
import Blog from '../../services/blogs'
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  FormTextarea,
  Button
} from "shards-react"
import { Constants, Dispatcher } from "../../flux";

const NewDraft = ({draftCount}) => {
  const title = "Quick Post"

  const dateForamat = {year: 'numeric', month: 'long', day: 'numeric'}
  const today = new Date().toLocaleDateString("en-US", dateForamat)
  const [post, setPost] = useState({
    title: '',
    body: '',
    backgroundImage: '', 
    category: {design: false, development: false, writting: false, books: false},
    categoryTheme: '',
    date: today
  })

  const draftOnSubmit = async(event) => {
    event.preventDefault()
    const added = await Blog.addNewPostDraft(post)
    Dispatcher.dispatch({
      actionType: Constants.ADD_NEW_DRAFT,
      payload: {
        ...post,
        _id: added
      }
    })
    setPost({...post, title: '', body: '', date: today})
    draftCount(1)
  }

  return(
    <Card small className="h-100">
    {/* Card Header */}
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>

    <CardBody className="d-flex flex-column">
      <Form className="quick-post-form" onSubmit={draftOnSubmit} >
        {/* Title */}
        <FormGroup>
          <FormInput placeholder="Brave New World" value={post.title} onChange={e=> setPost({...post, title: e.target.value})} />
        </FormGroup>

        {/* Body */}
        <FormGroup>
          <FormTextarea placeholder="Words can be like X-rays if you use them properly..." value={post.body} onChange={e=> setPost({...post, body: e.target.value})} />
        </FormGroup>

        {/* Create Draft */}
        <FormGroup className="mb-0">
          <Button theme="accent" type="submit">
            Add to Draft
          </Button>
        </FormGroup>
      </Form>
    </CardBody>
    </Card>
  )
};

export default NewDraft;
