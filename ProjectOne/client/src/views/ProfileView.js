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
import Errors from "./Errors";

const ProfileView = () => {
  const [userName, setUserName] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    UserTimeline.addChangeListener(setDetails)

    return () => UserTimeline.removeChangeListener(setDetails)
  }, [])

  const setDetails = () => {
    setError(!UserTimeline.getUserTimeline().id)
    setUserName(UserTimeline.getUserTimeline().fullName)
  }

  return (
    <Container fluid className="main-content-container px-4">
      {error && <Errors />}
      {!error && <Row noGutters className="page-header py-4">
        <PageTitle title={userName} subtitle="Profile" md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>}
      {!error && <Row>
        <Col lg="8">
          <PostsList />
        </Col>
        <Col lg="4">
          <UserDetails />
        </Col>
      </Row>}
    </Container>
  )
}

export default ProfileView;