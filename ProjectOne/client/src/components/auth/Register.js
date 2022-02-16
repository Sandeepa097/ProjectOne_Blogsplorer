import React, {useState} from 'react'
import {
    FormGroup, 
    FormInput, 
    Button, 
    Form
} from 'shards-react'
import User from '../../services/users'
import { Dispatcher, Constants } from '../../flux'

const RegisterTest = ({setForm}) => {
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
                    color: ""
                })
            }, 5000)
            return null
        }

        setCreating({...creating, 
            message: 'Please wait. Your account being created...',
            color: "pink"
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
                actionType: Constants.LOGGED,
                payload: true
              })
        }
    }

    return (
        <div className="div-reg">
            <h4 className='title'>REGISTER</h4>
            <Form style = {{paddingTop: "5%", paddingBottom: "5%"}} onSubmit={onSubmitUser}>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="firstName">First Name:</label>
                    <FormInput
                        id="firstName"
                        placeholder="First Name"
                        value={user.feFirstName}
                        onChange = {e => setUser({...user, firstName: e.target.value})}
                        required
                    />
                </FormGroup>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="lastName">Last Name:</label>
                    <FormInput
                        id="lastName"
                        placeholder="Last Name"
                        value={user.feLasttName}
                        onChange = {e => setUser({...user, lastName: e.target.value})}
                    />
                </FormGroup>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="email">Email:</label>
                    <FormInput
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        value={user.feEmail}
                        onChange = {e => setUser({...user, email: e.target.value})}
                        required
                    />
                </FormGroup>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="password">Password:</label>
                    <FormInput valid = {user.password === confirmedPass && !!user.password}
                        invalid = {user.password !== confirmedPass && !!confirmedPass}
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={user.password}
                        onChange = {e => setUser({...user, password: e.target.value})}
                        required
                    />
                </FormGroup>
                <FormGroup className="form-auth">
                    <label className='input-label' htmlFor="conPassword">Confirm Password:</label>
                    <FormInput valid = {user.password === confirmedPass && !!user.password}
                        invalid = {user.password !== confirmedPass && !!confirmedPass}
                        type="password"
                        id="conPassword"
                        placeholder="Repeat Password"
                        value = {confirmedPass}
                        onChange = {e => setConfirmedPass(e.target.value)}
                        required
                    />
                </FormGroup>
                {!!creating.message && <span style={{"color": `${creating.color}`}}>{'  ' + creating.message}</span>}
                <FormGroup style={{paddingTop: "5%"}}>
                    <Button type="submit" theme="accent">Register</Button>
                </FormGroup>
                    <span className='title'>Already have an account? <div onClick={() => setForm(true)} style={{color: "pink", fontWeight: "bolder", display: "inline"}}>Log In</div></span>
            </Form>
        </div>
    )
}

export default RegisterTest
