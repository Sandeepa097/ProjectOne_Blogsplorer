import axios from 'axios'
import Headers from './setHeaders'

const draftUrl = 'http://localhost:3001/api/draft'
const publishUrl = 'http://localhost:3001/api/blogs'

const newPostPublished = async(newPost) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.post(publishUrl, newPost, config)
    return response.data
}

const getPostsPublished = async(pageNumber) => {
    const response = await axios.get(publishUrl+ '/' + pageNumber)
    return response.data
}

const addNewPostDraft = async(newPost) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.put(draftUrl, newPost, config)
    return response.data
}

const deletePostDraft = async(id) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.delete(draftUrl + '/' + id, config)
    return response.data
}

const getPostsDraft = async(limit) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.get(draftUrl + '/' + limit, config)
    return response.data
}

const publishPostFromDraft = async(id) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.get(draftUrl + '/publish/' + id, config)
    return response.data
}

const blog = async(id, ni) => {
    const param = ni ? '/published/' : '/ipublished/'
    const response = await axios.get(publishUrl + param + id)
    return response.data
}

export default {
    newPostPublished,
    getPostsPublished,
    addNewPostDraft,  
    deletePostDraft,  
    getPostsDraft,
    publishPostFromDraft,
    blog
}