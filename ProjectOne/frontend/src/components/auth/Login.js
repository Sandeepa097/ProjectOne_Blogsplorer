import React, {useState} from 'react'
import {FormInput, Button, Card, ListGroupItem, ListGroup, CardHeader, Row, Form, Col, FormGroup} from 'shards-react'
import User from '../../services/users'
import { Dispatcher, Constants } from '../../flux'

const LoginTest = ({setForm}) => {
    const [errorMessage, setErrorMessage] = useState({
        message: "",
        color: ""
    })
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const submitLogin = async(event) => {
        setErrorMessage({
            message: "Please wait...",
            color: "green"
        })
        event.preventDefault()
        const logged = await User.login(user)
        if(!!logged.error) {
            setErrorMessage({
                message: logged.error,
                color: "red"
            })
            setTimeout(() => {
                setErrorMessage({
                    message: "",
                    color: ""
                })
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
        <div className="div-log">
            <h4 className='title'>LOG IN</h4>
            <Form style = {{paddingTop: "5%", paddingBottom: "5%"}} onSubmit ={submitLogin}>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="feFirstName">Email:</label>
                    <FormInput
                        type="email"
                        id="feFirstName"
                        placeholder="Email Address"
                        value = {user.feEmail}
                        onChange = {e => setUser({...user, email: e.target.value})}
                        required
                    />
                </FormGroup>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="fePassword">Password:</label>
                    <FormInput
                        type="password"
                        id="fePassword"
                        placeholder="Password"
                        value = {user.password}
                        onChange = {e => setUser({...user, password: e.target.value})}
                        required
                    />
                </FormGroup>
                {!!errorMessage.message && <span style={{"color": `${errorMessage.color}`}}>{'  ' + errorMessage.message}</span>}
                <FormGroup style={{paddingTop: "5%"}}>
                    <Button type="submit" theme="accent">LOG IN</Button>
                </FormGroup>
                    <span className='input-label'>New User? <a onClick={() => setForm(false)} style={{color: "pink", fontWeight: "bolder"}}>Create Account</a></span>
            </Form>
        </div>
    )
}

export default LoginTest
