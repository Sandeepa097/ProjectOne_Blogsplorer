import React, {useEffect, useState} from "react";
import {
  Container,
  Row,
  Col,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import PostsList from "../components/profile/postsList";
import UserDetails from "../components/profile/userDetails";
import { UserTimeline } from "../flux";

const OtherUserProfile = () => {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    UserTimeline.addChangeListener(setDetails)

    return () => UserTimeline.removeChangeListener(setDetails)
  }, [])

  const setDetails = () => {
    setUserName(UserTimeline.getUserTimeline().firstName + ' ' + UserTimeline.getUserTimeline().lastName)
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title={userName} subtitle="Profile" md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>
      <Row>
        <Col lg="8">
          <PostsList />
        </Col>
        <Col lg="4">
          <UserDetails />
        </Col>
      </Row>
    </Container>
  )
}

export default OtherUserProfile;