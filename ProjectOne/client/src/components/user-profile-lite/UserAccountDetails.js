import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button
} from "shards-react";
import User from "../../services/users"
import Country from "country-list-js";
import {UserStore, Dispatcher, Constants} from "../../flux"

const UserAccountDetails = () => {
  const title = "Account Details"

  const [userDetails, setUserDetails] = useState({
    ...UserStore.getUserDetails(),
    authorAvatar: null
  })
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    UserStore.addChangeListener(setDetails)
    return() => {
      UserStore.removeChangeListener(setDetails)
    }
  }, [])

  const setDetails = () => {
    const _userDetails = UserStore.getUserDetails()
    setUserDetails({...userDetails,
      firstName: _userDetails.firstName,
      lastName: _userDetails.lastName,
      email: _userDetails.email,
      address: _userDetails.address,
      city: _userDetails.city,
      state: _userDetails.state,
      country: _userDetails.country,
      description: _userDetails.description
    })
    setAvatar(_userDetails.authorAvatar)
  }

  const onChangeDetails = (e, field) => {
    const updates = {}
    updates[field] = e.target.value
    setUserDetails({...userDetails, ...updates})
  }

  const onClickSubmit = async(event) => {
    let fullName = userDetails.firstName + " " + userDetails.lastName
    event.preventDefault()
    if(!userDetails.authorAvatar) {
      Dispatcher.dispatch({
        actionType: Constants.RECIEVE_USER,
        payload: {...userDetails, fullName: fullName, authorAvatar: avatar}
      })
      await User.updateUserDetails({...userDetails, authorAvatar: avatar})
    }
    else {
      const reader = new FileReader()
      reader.readAsDataURL(userDetails.authorAvatar)
      reader.onloadend = async() => {
        Dispatcher.dispatch({
          actionType: Constants.RECIEVE_USER,
          payload: {...userDetails, fullName: fullName, authorAvatar: reader.result}
        })
        await User.updateUserDetails({...userDetails, authorAvatar: reader.result})
      }
    }
  }

  const chooseImage = (event) => {
    setUserDetails({...userDetails, authorAvatar: event.target.files[0]})
  }

  return(
    <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form onSubmit = {onClickSubmit}>
              <Row form>
                {/* First Name */}
                <Col md="6" className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <FormInput
                    id="firstName"
                    placeholder="First Name"
                    value={userDetails.firstName}
                    onChange={(e) => onChangeDetails(e, e.target.id)}
                    required
                  />
                </Col>
                {/* Last Name */}
                <Col md="6" className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <FormInput
                    id="lastName"
                    placeholder="Last Name"
                    value={userDetails.lastName}
                    onChange={(e) => onChangeDetails(e, e.target.id)}
                    required
                  />
                </Col>
              </Row>
              <Row form>
                {/* Email */}
                <Col md="6" className="form-group">
                  <label htmlFor="email">Email</label>
                  <FormInput
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    value={userDetails.email}
                    onChange={(e) => onChangeDetails(e, e.target.id)}
                    autoComplete="email"
                    required
                  />
                </Col>
                {/* Password */}
                <Col md="6" className="form-group">
                  <label htmlFor="userAvatar">Change Profile Picture</label>
                  <input 
                    type="file" 
                    id="userAvatar" 
                    accept="image/*"
                    onChange={e => chooseImage(e)} />
                </Col>
              </Row>
              <FormGroup>
                <label htmlFor="address">Address</label>
                <FormInput
                  id="address"
                  placeholder="Address"
                  value={userDetails.address}
                  onChange={(e) => onChangeDetails(e, e.target.id)}
                />
              </FormGroup>
              <Row form>
                {/* City */}
                <Col md="6" className="form-group">
                  <label htmlFor="city">City</label>
                  <FormInput
                    id="city"
                    placeholder="City"
                    value={userDetails.city}
                    onChange={(e) => onChangeDetails(e, e.target.id)}
                  />
                </Col>
                {/* State */}
                <Col md="4" className="form-group">
                  <label htmlFor="state">State</label>
                  <FormInput 
                    id="state" 
                    placeholder="State"
                    value={userDetails.state} 
                    onChange={(e) => onChangeDetails(e, e.target.id)}
                  />
                </Col>
                {/* Zip Code */}
                <Col md="2" className="form-group">
                  <label htmlFor="country">Country</label>
                  <FormSelect
                    id="country"
                    value={userDetails.country}
                    onChange={(e) => onChangeDetails(e, e.target.id)}
                  >
                    {Country.names().sort().map((item, idx) =>
                      <option key={idx}>{item}</option>
                    )}
                  </FormSelect>
                </Col>
              </Row>
              <Row form>
                {/* Description */}
                <Col md="12" className="form-group">
                  <label htmlFor="description">Description</label>
                  <FormTextarea id="description" rows="5" value={userDetails.description} onChange={(e) => onChangeDetails(e, e.target.id)}/>
                </Col>
              </Row>
              <Button type="submit" theme="accent">Update Account</Button>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
  )
};

export default UserAccountDetails;
