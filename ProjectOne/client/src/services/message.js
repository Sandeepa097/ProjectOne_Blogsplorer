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
    console.log('messages', response.data)
    return response.data
}

export default {
    getMessages
}