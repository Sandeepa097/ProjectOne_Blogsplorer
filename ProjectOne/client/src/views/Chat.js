import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import AuthorsOnline from '../components/chat/AuthorsOnline'
import ChatBox from '../components/chat/ChatBox'
import SocketContext from '../websocket/socketContext'
import { ChatStore } from '../flux';

const Chat = () => {
    const [chatWith, setChatWith] = useState(ChatStore.getChatWith().id)

    useEffect(() => {
        ChatStore.addChangeListener(setDetails)
        return () => {
            ChatStore.removeChangeListener(setDetails)
        }
    }, [])

    const setDetails = () => {
        const id = ChatStore.getChatWith().id
        setChatWith(id)
    }

    return (
        <Container fluid className="main-content-container px-4 pb-4">
            <Row noGutters className="page-header py-4">
                <PageTitle sm="4" title="Messages" subtitle="Chat with authors" className="text-sm-left" />
            </Row>

            <Row>
                <Col className="col-12" lg="4" md="12" sm="12">
                    <SocketContext.Consumer>
                        {socket => <AuthorsOnline socket={socket} />}
                    </SocketContext.Consumer>
                </Col>

                <Col className="col-12" lg="8" md="12" sm="12">
                    {chatWith && <SocketContext.Consumer>
                        {socket => <ChatBox socket={socket} />}
                    </SocketContext.Consumer>}
                </Col>
            </Row>

        </Container>
    )
}

export default Chat
