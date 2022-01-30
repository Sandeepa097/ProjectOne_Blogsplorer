/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, {useState, useEffect} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button
} from "shards-react";

import LoadingIndicator from "../components/common/LoadingIndicator"
import PageTitle from "../components/common/PageTitle"
import Blog from "../services/blogs"
import { PostStore, Dispatcher, Constants } from "../flux"

const BlogPosts = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [noNextPage, setNoNextPage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [postsListOne, setPostsListOne] = useState(PostStore.getPosts().postsListOne)
  const [postsListTwo, setPostsListTwo] = useState(PostStore.getPosts().postsListTwo)
  const [postsListThree, setPostsListThree] = useState(PostStore.getPosts().postsListThree)
  const [postsListFour, setPostsListFour] = useState(PostStore.getPosts().postsListFour)

  useEffect(() => {
    setLoading(true)
    PostStore.addChangeListener(setBlogPosts)
    Blog.getPostsPublished(pageNumber).then(blogList => {
      setNoNextPage(blogList.noNextPage)
      Dispatcher.dispatch({
        actionType: Constants.RECIEVE_POSTS, 
        payload: {
          postsListOne: blogList.blogsList.slice(0, 4),
          postsListTwo: blogList.blogsList.slice(4, 6),
          postsListThree: blogList.blogsListNoImage,
          postsListFour: blogList.blogsList.slice(6, 10)
        }
      })
      
      window.scrollTo({
        top: 0,
        behavior: "auto"
      })
  
      setLoading(false)
    })

    return () => {
      PostStore.removeChangeListener(setBlogPosts)
    }
  }, [pageNumber])

  const setBlogPosts = () => {
    const postsList = PostStore.getPosts()
    setPostsListOne(postsList.postsListOne)
    setPostsListTwo(postsList.postsListTwo)
    setPostsListThree(postsList.postsListThree)
    setPostsListFour(postsList.postsListFour)
  }
  
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Blog Posts" subtitle="Publications" className="text-sm-left" />
      </Row>
      <Button onClick={e => setPageNumber(pageNumber - 1)} hidden={!(pageNumber - 1)}>GO BACK</Button>
      {loading && <LoadingIndicator />}
      
      {/* First Row of Posts */}
      <Row>
        {!loading && postsListOne.map((post, idx) => (
          <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
            <Card small className="card-post card-post--1" style={{height: '500px', maxHeight: '500px'}}>
              <div
                className="card-post__image"
                style={{ backgroundImage: `url(${post.backgroundImage})` }}
              >
                <Badge
                  pill
                  className={`card-post__category bg-${post.categoryTheme}`}
                >
                  {post.category}
                </Badge>
                <div className="card-post__author d-flex">
                  <a
                    href={"/user?id=" + post.authorID}
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by {post.author}
                  </a>
                </div>
              </div>
              <CardBody>
              <a href={"/blog?id=" + post._id} className="text-fiord-blue">
                <h5 className="card-title">
                    {post.title}
                </h5>
              </a>
                <p className="card-text d-inline-block mb-3">{post.body.slice(0, (110 - post.title.length)).toString().replace(/<\/?[^>]+(>|$)/g, "")+ '... '}
                </p>
                <a href={"/blog?id=" + post._id} style={{color: "brown"}}>Read More</a>
              
              </CardBody>
              <CardFooter>
                <span className="text-muted">{post.date}</span>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Second Row of Posts */}
      <Row>
        {!loading && postsListTwo.map((post, idx) => (
          <Col lg="6" sm="12" className="mb-4" key={idx}>
            <Card small className="card-post card-post--aside card-post--1" style={{height: '250px', maxHeight: '250px'}}>
              <div
                className="card-post__image"
                style={{ backgroundImage: `url('${post.backgroundImage}')`, minHeight: "100%" }}
              >
                <Badge
                  pill
                  className={`card-post__category bg-${post.categoryTheme}`}
                >
                  {post.category}
                </Badge>
                
                <div className="card-post__author d-flex">
                  <a
                    href={"/user?id=" + post.authorID}
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by {post.author}
                  </a>
                </div>
              </div>
              <CardBody>
                <h5 className="card-title">
                  <a className="text-fiord-blue" href={"/blog?id=" + post._id}>
                    {post.title}
                  </a>
                </h5>
                <p className="card-text d-inline-block mb-3">{post.body.slice(0, (125 - post.title.length)).toString().replace(/<\/?[^>]+(>|$)/g, "")+ '... '}
                </p> 
                <p>
                  <a href={"/blog?id=" + post._id} style={{color: "brown"}}>Read More</a>
                </p>       
                <p>     
                  <span className="text-muted">{post.date}</span>
                </p>  
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Third Row of Posts */}
      <Row>
        {!loading && postsListThree.map((post, idx) => (
          <Col lg="4" key={idx}>
            <Card small className="card-post mb-4" style={{height: '300px', maxHeight: '300px'}}>
              <CardBody>
              <h5 className="card-title">
                  <a href={"/blog?id=" + post._id + '&ni=' + true} className="text-fiord-blue">
                    {post.title}
                  </a>
                </h5>
                <p className="card-text text-muted">{post.body.slice(0, (110 - post.title.length)).toString().replace(/<\/?[^>]+(>|$)/g, "")+ '... '}
                </p>
                <a href={"/blog?id=" + post._id + '&ni=' + true} style={{color: "brown"}}>Read More</a>
              </CardBody>
              <CardFooter className="border-top d-flex">
                <div className="card-post__author d-flex">
                  <a
                    href={"/user?id=" + post.authorID}
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by {post.author}
                  </a>
                  <div className="d-flex flex-column justify-content-center ml-3">
                    <span className="card-post__author-name">
                      {post.author}
                    </span>
                    <small className="text-muted">{post.date}</small>
                  </div>
                </div>
                <div className="my-auto ml-auto">
                  <Badge
                    pill
                    className={`card-post__category bg-${post.categoryTheme}`}
                  >
                    {post.category ? post.category.toUpperCase() : ''}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Fourth Row of posts */}
      <Row>
        {!loading && postsListFour.map((post, idx) => (
          <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
            <Card small className="card-post card-post--1" style={{height: '500px', maxHeight: '500px'}}>
              <div
                className="card-post__image"
                style={{ backgroundImage: `url(${post.backgroundImage})` }}
              >
                <Badge
                  pill
                  className={`card-post__category bg-${post.categoryTheme}`}
                >
                  {post.category}
                </Badge>
                <div className="card-post__author d-flex">
                  <a
                    href={"/user?id=" + post.authorID}
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by {post.author}
                  </a>
                </div>
              </div>
              <CardBody>
                <h5 className="card-title">
                  <a href={"/blog?id=" + post._id} className="text-fiord-blue">
                    {post.title}
                  </a>
                </h5>
                <p className="card-text d-inline-block mb-3">{post.body.slice(0, (110 - post.title.length)).toString().replace(/<\/?[^>]+(>|$)/g, "")+ '... '}
                </p>
                <a href={"/blog?id=" + post._id + '&ni=' + true} style={{color: "brown"}}>Read More</a>
              </CardBody>
              <CardFooter>
                <span className="text-muted">{post.date}</span>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>
      {!loading && <Button onClick={e => setPageNumber(pageNumber + 1)} hidden={noNextPage}>SEE MORE</Button>}
    </Container>
  );
}

export default BlogPosts;
