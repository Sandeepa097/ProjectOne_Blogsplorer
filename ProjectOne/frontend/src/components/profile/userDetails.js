import React, {useEffect, useState} from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem
} from "shards-react";
import { UserTimeline } from "../../flux";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    authorAvatar: null, 
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    description: ""
  })

  useEffect(() => {
    UserTimeline.addChangeListener(setDetails)

    return () => UserTimeline.removeChangeListener(setDetails)
  }, [])

const setDetails = () => {
    const details = UserTimeline.getUserTimeline()
    setUserDetails({...userDetails,
      authorAvatar: details.authorAvatar, 
      firstName: details.firstName,
      lastName: details.lastName,
      address: details.address,
      city: details.city,
      state: details.state,
      country: details.country,
      description: details.description
    })
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
      <span className="text-muted d-block mb-2">{userDetails.country}</span>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          Description
        </strong>
        <span>{userDetails.description}</span>
      </ListGroupItem>
      <ListGroupItem className="px-4">
          <strong className="text-muted d-block mb-2">
            First Name
          </strong>
          <span>{userDetails.firstName}</span>
      </ListGroupItem>
      <ListGroupItem className="px-4">
          <strong className="text-muted d-block mb-2">
            Last Name
          </strong>
          <span>{userDetails.lastName}</span>
      </ListGroupItem>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          Address
        </strong>
        <span>{userDetails.address, ', ', userDetails.city, ', ', userDetails.state, ', ', userDetails.country}</span>
      </ListGroupItem>
    </ListGroup>
  </Card>
  )
}

export default UserDetails;