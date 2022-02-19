import React, {useState, useEffect} from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Badge,
} from "shards-react";
import User from "../../services/users"
import Message from "../../services/message"
import { ActiveAuthorStore, ChatStore, Constants, Dispatcher } from '../../flux';
import chatStore from '../../flux/chatStore';

const AuthorsOnline = ({socket}) => {
    const userId = sessionStorage.getItem('userId')
    const [allAuthors, setAllAuthors] = useState([])
    const [activeAuthors, setActiveAuthors] = useState([...ActiveAuthorStore.getActive()])
    const [messages, setMessages] = useState(chatStore.getMessages())
    const [typing, setTyping] = useState('')
    
    useEffect(() => {
        ActiveAuthorStore.addChangeListener(setDetails)
        ChatStore.addChangeListener(setMsg)
        setMessages({...ChatStore.getMessages()})
        User.detailsOfAll().then(details => {
            setAllAuthors([...details.filter(details => details.id !== userId)])
        })
        socket.on('typing', (type) => {
            if(type.isTyping){
                setTyping(type.from)
            }
            else{
                setTyping('')
            }
        })

        return(() => {
            Dispatcher.dispatch({
                actionType: Constants.RESET_CHAT_WITH
            })
            socket.removeAllListeners('typing')
            ChatStore.removeChangeListener(setMsg)
            ActiveAuthorStore.removeChangeListener(setDetails)
        })
    }, [])

    const setDetails = () => {
        const details = ActiveAuthorStore.getActive()
        setActiveAuthors([...details])
    }

    const setMsg = () => {
        setMessages({...ChatStore.getMessages()})
    }

    const setChatWith = (details) => {
        Dispatcher.dispatch({
            actionType: Constants.RECIEVE_CHAT_WITH,
            payload: details
        })
        const msgs = messages.new.filter(msg => msg.from === details.id)
        Message.msgSeen({id: details.id, msg: msgs})
    }

    return (
        <Card small className="mb-3">
            <CardHeader className="border-bottom">
                <h6 className="m-0">Click to Chat</h6>
            </CardHeader>
            <CardBody>
                {allAuthors.map((item, idx) => {
                    const author = activeAuthors.find(active => active === item.id)
                    const newMessages = messages.new.filter(msg => msg.from === item.id)
                    return (
                        <div key={idx}>
                        <Button theme="light" 
                            onClick={e => setChatWith({
                                id: item.id,
                                authorAvatar: item.authorAvatar,
                                fullName: item.fullName,
                                online: !!author
                        })}>
                            {!!item.authorAvatar && <img
                                className="user-avatar rounded-circle mr-2"
                                style={{width: "25px", height: "25px"}}
                                src={item.authorAvatar}
                                alt={item.fullName}
                            />}
                            {!item.authorAvatar && <i className="material-icons mr-2" style={{fontSize: "25px", verticalAlign: "middle"}}>account_circle</i>}
                            {" "}
                            <span className="d-inline-block d-md-inline-block">{item.fullName}</span>
                            {!!author && <span style={{"color": "green"}}> ●</span>}
                        </Button>
                        {typing === item.id && <span style={{color: "green", paddingLeft: "5px"}}>typing...</span>}
                        {!!newMessages.length && <Badge pill theme="accent" style={{float: "right"}}>
                                {newMessages.length}
                        </Badge>}
                        </div>
                    )
                })}
            </CardBody>
        </Card>
    )
}

export default AuthorsOnline
