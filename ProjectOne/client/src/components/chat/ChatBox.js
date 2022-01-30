import React, {useState, useEffect} from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    FormInput,
    Button,
    Form,
  } from "shards-react";
import { ChatStore } from '../../flux';

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
        console.log('message', message)
        if(message){
            socket.emit('message', message)
            setMessage('')
        }
    }

    return (
        <Card small className="mb-3">
            <CardHeader>
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
