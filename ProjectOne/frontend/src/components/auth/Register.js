import React, {useState} from 'react'
import {FormInput, Button, Card, ListGroupItem, ListGroup, CardHeader, Row, Form, Col} from 'shards-react'
import User from '../../services/users'
import { Dispatcher, Constants } from '../../flux'

const Register = () => {
    const dateForamat = {year: 'numeric', month: 'long', day: 'numeric'}
    const today = new Date().toLocaleDateString("en-US", dateForamat)

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        date: today
    })
    const [confirmedPass, setConfirmedPass] = useState('')
    const [creating, setCreating] = useState({
        message: '',
        color: ''
    })

    const onSubmitUser = async(event) => {
        event.preventDefault()
        if(user.password !== confirmedPass){
            setCreating({...creating, 
                message: 'Passwords do not match',
                color: "red"
            })
            setTimeout(() => {
                setCreating({...creating, 
                message: '',
                color: ''
                })
            }, 3000)
            return null
        }

        setCreating({...creating, 
            message: 'Please wait. Your account being created...',
            color: "green"
        })
        const logged = await User.createAccount(user)
        if(!!logged.error){
            setCreating({...creating,
                message: logged.error,
                color: 'red'
            })
        }
        if(logged.id){
            Dispatcher.dispatch({
                actionType: Constants.RECIEVE_USER,
                payload: {id: logged.id}
              })
        }
    }

    return (
        <Card style={{height: '500px', maxHeight: '500px'}}>
            <CardHeader className="border-bottom">
                <h3 className="m-0">Sign Up</h3>
            </CardHeader>
            <ListGroup flush>
                <ListGroupItem className="p-3">
                    <Col md="12" className="form-group">
                    <Form onSubmit={onSubmitUser}>
                    <Row>
                        <label htmlFor="firstName">First Name<font color="red"> *</font></label>
                        <FormInput
                            id="firstName"
                            placeholder="First Name"
                            value={user.feFirstName}
                            onChange = {e => setUser({...user, firstName: e.target.value})}
                            required
                        />
                    </Row>
                    <Row>
                        <label htmlFor="lastName">Last Name</label>
                        <FormInput
                            id="lastName"
                            placeholder="Last Name"
                            value={user.feLasttName}
                            onChange = {e => setUser({...user, lastName: e.target.value})}
                        />
                    </Row>
                    <Row>
                        <label htmlFor="email">Email<font color="red"> *</font></label>
                        <FormInput
                            type="email"
                            id="email"
                            placeholder="Email Address"
                            value={user.feEmail}
                            onChange = {e => setUser({...user, email: e.target.value})}
                            required
                        />
                    </Row>
                    <Row>
                        <label htmlFor="password">Password<font color="red"> *</font></label>
                        <FormInput valid = {creating.color === "green"}
                            invalid = {creating.color === "red"}
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={user.password}
                            onChange = {e => setUser({...user, password: e.target.value})}
                            required
                        />
                    </Row>
                    <Row>
                        <label htmlFor="conPassword">Confirm Password<font color="red"> *</font></label>
                        <FormInput valid = {creating.color === "green"}
                            invalid = {creating.color === "red"}
                            type="password"
                            id="conPassword"
                            placeholder="Repeat Password"
                            value = {confirmedPass}
                            onChange = {e => setConfirmedPass(e.target.value)}
                            required
                        />
                    </Row><br />
                    <Button type="submit" theme="success">CREATE ACCOUNT</Button>
                    {creating.message && <span style={{"color": `${creating.color}`}}>{'  ' + creating.message}</span>}
                    </Form>
                    </Col>
                </ListGroupItem>
            </ListGroup>           
        </Card>
    )
}

export default Register
