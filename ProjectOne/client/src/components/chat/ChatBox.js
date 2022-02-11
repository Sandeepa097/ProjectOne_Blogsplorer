import React, {useState, useEffect} from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    FormInput,
    Button,
    Form,
  } from "shards-react";
import { ChatStore, UserStore, Constants, Dispatcher } from '../../flux';

const ChatBox = ({socket}) => {
    const [message, setMessage] = useState('')
    const [chatWith, setChatWith] = useState(ChatStore.getChatWith())

    useEffect(() => {
        ChatStore.addChangeListener(setDetails)
        return () => {
            ChatStore.removeChangeListener(setDetails)
        }
    }, [])

    const setDetails = () => {
        const details = ChatStore.getChatWith()
        setChatWith({...details})
    }

    const sendMessage = (event) => {
        event.preventDefault()
        if(message){
            const msg = {to: chatWith.id, body: message, from: UserStore.getUserDetails().id}
            Dispatcher.dispatch({
                actionType: Constants.SEND_MESSAGE,
                payload: msg
            })
            socket.emit('message', msg)
            setMessage('')
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
                <div>
                {chatWith.messages.map((msg, idx)=> (
                    <Button key={idx} theme="success" size="md" style={{display: "block", marginBottom: "5px"}}>
                        {msg.body}
                    </Button>
                ))}
                </div>
                <Form onSubmit={sendMessage}>
                    <FormInput
                        type="text"
                        id="message"
                        placeholder="Type here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <Button type="submit">SEND</Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default ChatBox
