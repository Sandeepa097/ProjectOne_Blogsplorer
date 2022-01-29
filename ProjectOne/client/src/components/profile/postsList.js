import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { confirm } from "react-confirm-box"
import { Card, CardHeader, CardBody, ButtonGroup, Button} from "shards-react";
import User from "../../services/users";
import Blog from "../../services/blogs";
import { UserTimeline, Dispatcher, Constants, UserStore } from "../../flux";
import LoadingIndicator from "../common/LoadingIndicator";

const PostList = () => {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])
    let params= (new URL(document.location)).searchParams
    let id = params.get("id")
    let mine = id === UserStore.getUserDetails().id

    useEffect(() => {
        setLoading(true)
        UserTimeline.addChangeListener(setDetails)
        User.userTimeline(id).then(details => {
          Dispatcher.dispatch({
            actionType: Constants.RECIEVE_TIMELINE,
            payload: details
          })
          setLoading(false)
        })

        return () => UserTimeline.removeChangeListener(setDetails)
      }, [id])
    
    const setDetails = () => {
        const publishes = UserTimeline.getUserTimeline().published
        if(!publishes){
          return null
        }
        setPosts([...publishes.blog.reverse(), ...publishes.blogNoImage.reverse()])
    }

    const onClickDelete = async(id, ni) => {
        const conf = await confirm("Are you sure you want to delete?")
        if(conf){
          Dispatcher.dispatch({
            actionType: ni ? Constants.DELETE_BLOG_NO_IMAGE : Constants.DELETE_BLOG,
            payload: id
          })
          await Blog.deleteBlog(id, ni)
        }
    }

    const onClickMove = async(id, ni) => {
      const conf = await confirm("Post will be unpublished after moving. Is it okay?")
      if(conf){
        Dispatcher.dispatch({
          actionType: ni ? Constants.DELETE_BLOG_NO_IMAGE : Constants.DELETE_BLOG,
          payload: id
        })
        await Blog.moveToDraft(id, ni)
      }
    }

    return(
        <div>
          {loading && <LoadingIndicator />}
          {!posts.length && !loading && <p>No Posts To Show...</p>}
          {!!posts.length && <Card small className="blog-comments">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Publications</h6>
            </CardHeader>
            <CardBody className="p-0">
              {posts.map((item, idx) => (
                <div key={idx} className="blog-comments__item d-flex p-3">
                  {/* Avatar */}
                  <div className="blog-comments__avatar mr-3">
                    <a href={"/blog?id=" + item.id + (!item.backgroundImage ? '&ni=' + true : "")}><img src={item.backgroundImage ? item.backgroundImage : null} alt={item.backgroundImage ? item.title.substring(0, 5) : null} /></a>
                  </div>
    
                  {/* Content */}
                  <div className="blog-comments__content">
                    {/* Content :: Title */}
                  <div className="blog-comments__meta text-mutes">
                    <a href={"/blog?id=" + item.id + (!item.backgroundImage ? '&ni=' + true : "")}>{item.title}<span style={{color: "brown"}}> - {item.date}</span></a>
                  </div>
    
                  {/* Content :: Body */}
                  <p className="m-0 my-1 mb-2 text-muted">{item.body.slice(0, 100).toString().replace(/<\/?[^>]+(>|$)/g, "") + '...'}</p>
    
                  {/* Content :: Actions */}
                  {mine && <div className="blog-comments__actions">
                    <ButtonGroup size="sm">
                    <Link to={"/blog?id=" + item.id + (!item.backgroundImage ? '&ni=' + true : "") + "&edit=true"} style={{textDecoration: 'none'}}>
                      <Button theme="white" >
                        <span className="text-success">
                          <i className="material-icons">edit</i>
                        </span>{" "}
                        Edit
                      </Button>
                      </Link>
                      <Button theme="white" onClick={() => {onClickMove(item.id, !item.backgroundImage)}}>
                        <span className="text-dark">
                          <i className="material-icons">block</i>
                        </span>{" "}
                        Move to Draft
                      </Button>
                      <Button theme="white" onClick={() => {onClickDelete(item.id, !item.backgroundImage)}}>
                        <span className="text-danger">
                          <i className="material-icons">delete</i>
                        </span>{" "}
                        Delete
                      </Button>
                    </ButtonGroup>
                  </div>}

                </div>
              </div>
            ))}
            </CardBody>
          </Card>}
        </div>
    )
}

export default PostList;