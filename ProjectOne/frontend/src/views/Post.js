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
import LoadingIndicator from "../components/common/LoadingIndicator";
import Errors from "./Errors";
import DOMPurify from "dompurify"

const Post = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blog, setBlog] = useState({})
  let params = (new URL(document.location)).searchParams
  let id = params.get("id")
  let ni = params.get("ni")

  useEffect(() => {
    setLoading(true)
    Blog.blog(id, ni).then(details => {
      setLoading(false)
      if(details.error || !details){
        setError(true)
      }
      setBlog({...details})
    })
  }, [id])

  return (
    <div>
      {error && <Errors />}
      {!error && <Container fluid className="main-content-container px-4">
      {loading && <LoadingIndicator />}
        <Row noGutters className="page-header py-4">
          <PageTitle title={blog.title} subtitle={blog.category} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="12">
            {!loading && <Card small className="mb-4 pt-3">
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
            </Card>}
          </Col>
        </Row>
      </Container>}
    </div>
  )
}

export default Post;