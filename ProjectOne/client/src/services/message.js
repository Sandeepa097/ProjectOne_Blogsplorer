import axios from 'axios'
import Headers from './setHeaders'

const baseurl = process.env.REACT_APP_BASE_URL
const messageUrl = `${baseurl}/message`

const getMessages = async() => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }

    const response = await axios.get(messageUrl, config)
    return response.data
}

const msgSeen = async(body) => {
    if(!body.msg[0]){
        return {}
    }
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }

    const response = await axios.put(messageUrl, body, config)
    return response.data
}

const sendMsg = async(body) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }

    const response = await axios.post(messageUrl, body, config)
    return response.data
}

export default {
    getMessages,
    msgSeen,
    sendMsg
}