import React, {useEffect, useState} from "react";
import { Card, CardHeader, CardBody, Row, Col, Container, ButtonGroup, Button} from "shards-react";
import User from "../../services/users";
import { UserTimeline, Dispatcher, Constants } from "../../flux";
import LoadingIndicator from "../common/LoadingIndicator";

const PostList = () => {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        setLoading(true)
        UserTimeline.addChangeListener(setDetails)
        let params = (new URL(document.location)).searchParams
        let id = params.get("id")
        User.userTimeline(id).then(details => {
          Dispatcher.dispatch({
            actionType: Constants.RECIEVE_TIMELINE,
            payload: details
          })
        })
        setLoading(false)

        return () => UserTimeline.removeChangeListener(setDetails)
      }, [])
    
    const setDetails = () => {
        const publishes = UserTimeline.getUserTimeline().published
        setPosts([...posts, ...publishes.blog.reverse(), ...publishes.blogNoImage.reverse()])
    }

    return(
        <div>
            {loading && <LoadingIndicator />}
            {!posts.length && <p>No Posts To Show...</p>}
        <Card small className="blog-comments">
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
                    <a href={"/blog?id=" + item.id + (!item.backgroundImage ? '&ni=' + true : "")}>{item.title}</a>
                </div>
    
                {/* Content :: Body */}
                <p className="m-0 my-1 mb-2 text-muted">{item.body.slice(0, 100).toString().replace(/<\/?[^>]+(>|$)/g, "") + '...'}</p>
    
                {/* Content :: Actions */}

              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
    )
}

export default PostList;