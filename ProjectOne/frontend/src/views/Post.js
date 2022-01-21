import React, {useEffect, useState} from "react";
import {
  Container,
  Card,
  Row,
  Col,
  CardBody
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Blog from "../services/blogs";
import DOMPurify from "dompurify"

const Post = () => {
  const [blog, setBlog] = useState({})
  let params = (new URL(document.location)).searchParams
  let id = params.get("id")
  let ni = params.get("ni")
  useEffect(() => {
    Blog.blog(id, ni).then(details => {
      setBlog({...details})
    })
  }, [])

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title={blog.title} subtitle={blog.category} md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>
      <Row>
        <Col lg="12">
          <Card small className="mb-4 pt-3">
            <CardBody>
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
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Post;