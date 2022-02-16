import axios from 'axios'
import Headers from './setHeaders'

const baseUrl = `${process.env.REACT_APP_BASE_URL}/count`

const totalPosts = async() => {
    const response = await axios.get(`${baseUrl}/posts`)
    return response.data
}

const youPublished = async() => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.get(`${baseUrl}/published`, config)
    return response.data
}

const yourDraft = async() => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.get(`${baseUrl}/draft`, config)
    return response.data
}

const authors = async() => {
    const response = await axios.get(`${baseUrl}/author`)
    return response.data
}

const docCount = async() => {
    return [
        await totalPosts(), 
        await youPublished(), 
        await yourDraft(), 
        await authors()
    ]
}

export default {
    docCount
}