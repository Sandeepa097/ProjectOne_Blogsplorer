import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Progress,
} from "shards-react";
import { UserStore } from "../../flux";

const UserDetails = () => {
  const [completed, setCompleted] = useState(0)
  const [userDetails, setUserDetails] = useState({
    ...UserStore.getUserDetails(),
    name: UserStore.getUserDetails().firstName + ' ' + UserStore.getUserDetails().lastName,
  })

  const countCompleted = (obj) => {
    let complete = 0;
    let length = 9;
    for (const item in obj) {
      if(item === 'draft' || item === 'published' || item === 'id' || item === 'date') {
        continue
      }

      if (obj[item]){
        complete++
      }
    }
    return Math.floor(complete*100/length)

  }

  useEffect(() => {
    UserStore.addChangeListener(setDetails)
    return() => {
      UserStore.removeChangeListener(setDetails)
    }
  }, [])

  const setDetails = () => {
    const details = UserStore.getUserDetails()
    setUserDetails({...userDetails,
      authorAvatar: details.authorAvatar,
      name: details.firstName + ' ' + details.lastName,
      description: details.description,
    })
    setCompleted(countCompleted(details))
  }

  return (
    <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <div className="mb-3 mx-auto">
        <img
          className="rounded-circle"
          src={!!userDetails.authorAvatar ? userDetails.authorAvatar : null}
          alt={!!userDetails.authorAvatar ? userDetails.name : null}
          width="110"
        />
      </div>
      <h4 className="mb-0">{userDetails.name}</h4>
      <span className="text-muted d-block mb-2">{userDetails.country}</span>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="px-4">
        <div className="progress-wrapper">
          <strong className="text-muted d-block mb-2">
            Profile Complete
          </strong>
          <Progress
            className="progress-sm"
            value={completed}
          >
            <span className="progress-value">
              {completed}%
            </span>
          </Progress>
        </div>
      </ListGroupItem>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          Description
        </strong>
        <span>{userDetails.description}</span>
      </ListGroupItem>
    </ListGroup>
  </Card>
  )
}

export default UserDetails;
