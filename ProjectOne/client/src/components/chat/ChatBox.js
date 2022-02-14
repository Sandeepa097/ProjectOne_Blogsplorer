import React, {useState, useEffect, useRef} from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Form,
    Row,
    Col,
    FormTextarea,
  } from "shards-react";
import Message from '../../services/message';
import { ChatStore, UserStore, Constants, Dispatcher } from '../../flux';
import '../../assets/chatbox.css'

const ChatBox = ({socket}) => {
    const chatbox = useRef(null)
    const [message, setMessage] = useState('')
    const [chatWith, setChatWith] = useState(ChatStore.getChatWith())
    const [typing, setTyping] = useState(false)

    const scrollToBottom = () => {
        return chatbox.current ? chatbox.current.scrollIntoView({ behavior: "auto" }) : null
    }

    useEffect(() => {
        ChatStore.addChangeListener(setDetails)
        scrollToBottom()
        socket.on('typing', (type) => {
            if(type.isTyping && type.from === chatWith.id){
                setTyping(true)
            }
            else{
                setTyping(false)
            }
        })
        return () => {
            ChatStore.removeChangeListener(setDetails)
        }
    }, [chatWith, typing])

    const setDetails = () => {
        const details = ChatStore.getChatWith()
        setChatWith({...details})
    }

    const typingMsg = (value) => {
        setMessage(value)
        socket.emit('typing', {isTyping: value.length > 0, to: chatWith.id, from: UserStore.getUserDetails().id})
    }

    const sendMessage = (event) => {
        event.preventDefault()
        if(message){
            const msg = {to: chatWith.id, body: message, from: UserStore.getUserDetails().id}
            Dispatcher.dispatch({
                actionType: Constants.SEND_MESSAGE,
                payload: msg
            })
            socket.emit('typing', {isTyping: false, to: chatWith.id, from: UserStore.getUserDetails().id})
            socket.emit('message', msg)
            setMessage('')
            Message.sendMsg(msg)
        }
    }

    return (
        <Card small className="mb-3">
            <CardHeader className="border-bottom">
            {!!chatWith.authorAvatar && <img
                    className="user-avatar rounded-circle mr-2"
                    style={{width: "35px", height: "35px"}}
                    src={chatWith.authorAvatar}
                    alt={chatWith.fullName}
                />}
                {!chatWith.authorAvatar && <i className="material-icons mr-2" style={{fontSize: "35px", verticalAlign: "middle"}}>account_circle</i>}
                {" "}
                <span className="d-none d-md-inline-block">{chatWith.fullName}</span>
                {!!chatWith.online && <span style={{"color": "green"}}> ●</span>}
            </CardHeader>
            <CardBody>
                <div style={{height: "400px", overflowY: "auto", overflowX: "hidden"}}>
                {chatWith.messages.map((msg, idx)=> (
                    <div key={idx}> 
                    
                    {msg.from === chatWith.id && <Row><Col lg="8"><div className='recieved_msg'>
                        {msg.body}
                    </div></Col><Col lg="4"></Col></Row>}   
                    
                    {msg.to === chatWith.id && <Row><Col lg="4"></Col><Col lg="8"><div className='send_msg'>
                        {msg.body}
                    </div></Col></Row>}
                    </div>
                ))}
                <div>{typing && <span>typing...</span>}</div>
                <div ref={chatbox}></div>
                </div>
                <div style={{marginTop: "5px"}}>
                <Form onSubmit={sendMessage}>
                    <FormTextarea
                        type="text"
                        id="message"
                        placeholder="Type here..."
                        value={message}
                        onChange={(e) => typingMsg(e.target.value)}
                        required
                    />
                    <Button type="submit" pill style={{float: "right", marginTop: "5px"}} theme="dark" size="sm">SEND</Button>
                </Form>
                </div>
            </CardBody>
        </Card>
    )
}

export default ChatBox
