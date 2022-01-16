import React, {useEffect, useState} from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";

import { AddPostStore } from "../flux";

const AddNewPost = () => {

  const [post, setPost] = useState(AddPostStore.getPost())

  useEffect(() => {
    AddPostStore.addChangeListener(setDetails)
    return () => {
      AddPostStore.removeChangeListener(setDetails)
    }
  }, [])

  const setDetails = () => {
    console.log("SET_DETAILS", AddPostStore.getPost())
    setPost({...AddPostStore.getPost()})
  }

  return(
    <Container fluid className="main-content-container px-4 pb-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Add New Post" subtitle="Blog Posts" className="text-sm-left" />
    </Row>

    <Row>
      {/* Editor */}
      <Col lg="9" md="12">
        <Editor post= {post} setPost = {setPost} />
      </Col>

      {/* Sidebar Widgets */}
      <Col lg="3" md="12">
        <SidebarActions post={post} />
        <SidebarCategories post={post} setPost={setPost} />
      </Col>
    </Row>
  </Container>
  )
};

export default AddNewPost;
