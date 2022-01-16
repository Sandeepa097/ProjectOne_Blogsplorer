import React, {useState, useEffect} from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Button,
} from "shards-react";
import User from "../../services/users"
import { Constants, Dispatcher } from '../../flux';

const AuthorsOnline = ({socket}) => {
    const userId = sessionStorage.getItem('userId')
    const [allAuthors, setAllAuthors] = useState([])
    const [activeAuthors, setActiveAuthors] = useState([])
    
    useEffect(() => {
        User.detailsOfAll().then(details => {
            setAllAuthors([...details.filter(details => details.id !== userId)])
            socket.on('join', (data) => {
                setActiveAuthors([...data.filter(item => item !== userId)])
            })
        
            socket.on('user disconnect', (data) => {
                setActiveAuthors([...activeAuthors.filter(item => item !== data)])
            })
        })

    }, [])

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
                    return (
                        <div key={idx}>
                        <Button theme="light" 
                            onClick={e => setChatWith({
                                id: item.id,
                                authorAvatar: item.authorAvatar,
                                firstName: item.firstName,
                                lastName: item.lastName,
                                online: !!author
                        })}>
                            <img
                                className="user-avatar rounded-circle mr-2"
                                style={{width: "25px", height: "25px"}}
                                src={!!item.authorAvatar ? item.authorAvatar : null}
                                alt={!!item.authorAvatar ? item.firstName : null}
                            />{" "}
                            <span className="d-none d-md-inline-block">{item.firstName + ' ' + item.lastName}</span>
                            {!!author && <span style={{"color": "green"}}> ●</span>}
                        </Button>
                        </div>
                    )
                })}
            </CardBody>
        </Card>
    )
}

export default AuthorsOnline
