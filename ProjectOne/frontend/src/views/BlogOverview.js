import React, {useEffect, useState} from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
import UsersOverview from "./../components/blog/UsersOverview";
import UsersByDevice from "./../components/blog/UsersByDevice";
import NewDraft from "./../components/blog/NewDraft";
import Draft from "../components/blog/Draft";
//import TopReferrals from "./../components/common/TopReferrals";
import Count from '../services/docCount'
import LoadingIndicator from "../components/common/LoadingIndicator";

const BlogOverview = () => {
  const [loading, setLoading] = useState(true)
  const [smallStats, setSmallStats] = useState([])

  useEffect(() => {
    setLoading(true)
    Count.docCount().then(stats => {
      setSmallStats([...smallStats, ...stats])
      setLoading(false)
    })
  }, [])

  return (
    <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Blog Overview" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

    {/* Small Stats Blocks */}
    <Row>
      {loading && <LoadingIndicator />}
      {!loading && smallStats.map((stats, idx) => (
        <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
          <SmallStats
            id={`small-stats-${idx}`}
            variation="1"
            chartData={stats.datasets}
            chartLabels={stats.chartLabels}
            label={stats.label}
            value={stats.value}
            percentage={stats.percentage}
            increase={stats.increase}
            decrease={stats.decrease}
          />
        </Col>
      ))}
    </Row>

    <Row>
      {/* Users Overview
      <Col lg="8" md="12" sm="12" className="mb-4">
        <UsersOverview />
      </Col> */}

      {/* Users by Device
      <Col lg="4" md="6" sm="12" className="mb-4">
        <UsersByDevice />
      </Col> */}

      {/* New Draft */}
      <Col lg="5" md="6" sm="12" className="mb-4">
        <NewDraft />
      </Col>

      {/* Discussions */}
      <Col lg="7" md="12" sm="12" className="mb-4">
        <Draft />
      </Col>

      {/* Top Referrals 
      <Col lg="3" md="12" sm="12" className="mb-4">
        <TopReferrals />
      </Col>*/}
    </Row>
  </Container>
  )
}

export default BlogOverview;
