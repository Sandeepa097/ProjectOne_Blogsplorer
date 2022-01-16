import React, {useState} from 'react'
import {FormInput, Button, Card, ListGroupItem, ListGroup, CardHeader, Row, Form, Col} from 'shards-react'
import User from '../../services/users'
import { Dispatcher, Constants } from '../../flux'

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("")
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const submitLogin = async(event) => {
        event.preventDefault()
        const logged = await User.login(user)
        if(!!logged.error) {
            setErrorMessage(logged.error)
            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
        }
        if(logged.id){
            Dispatcher.dispatch({
                actionType: Constants.RECIEVE_USER,
                payload: {id: logged.id}
              })
        }
    }

    return (
        <Card small className="mb-4">
        <CardHeader className="border-bottom">
            <h3 className="m-0">Sign In</h3>
        </CardHeader>
        <ListGroup flush>
            <ListGroupItem className="p-3">
                <Col md="12" className="form-group">
                <Form onSubmit ={submitLogin}>
                <Row>
                    <label htmlFor="feFirstName">Email<font color="red"> *</font></label>
                    <FormInput
                        type="email"
                        id="feFirstName"
                        placeholder="Email Address"
                        value = {user.feEmail}
                        onChange = {e => setUser({...user, email: e.target.value})}
                        required
                    />
                </Row>
                <Row>
                    <label htmlFor="fePassword">Password<font color="red"> *</font></label>
                    <FormInput
                        type="password"
                        id="fePassword"
                        placeholder="Password"
                        value = {user.password}
                        onChange = {e => setUser({...user, password: e.target.value})}
                        required
                    />
                </Row><br />
                <Button type="submit" theme="accent">LOGIN</Button>
                {errorMessage && <span style={{"color": "red"}}>{'  ' + errorMessage}</span>}
                </Form>
                </Col>
            </ListGroupItem>
        </ListGroup>
    </Card>
    )
}

export default Login
