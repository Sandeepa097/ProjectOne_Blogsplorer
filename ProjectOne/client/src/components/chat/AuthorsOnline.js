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

const AuthorsOnline = () => {
    const userId = sessionStorage.getItem('userId')
    const [allAuthors, setAllAuthors] = useState([])
    const [activeAuthors, setActiveAuthors] = useState([...ActiveAuthorStore.getActive()])
    const [messages, setMessages] = useState({old: [], new: []})
    
    useEffect(() => {
        ActiveAuthorStore.addChangeListener(setDetails)
        ChatStore.addChangeListener(setMsg)
        setMessages({...ChatStore.getMessages()})
        User.detailsOfAll().then(details => {
            setAllAuthors([...details.filter(details => details.id !== userId)])
        })
        Message.getMessages().then(msg => {
            setMessages({...msg.message})
        })

        return(() => {
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
                            <span className="d-none d-md-inline-block">{item.fullName}</span>
                            {!!author && <span style={{"color": "green"}}> ●</span>}
                        </Button>
                        {!!newMessages.length && <Badge pill theme="danger">
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
