import axios from 'axios'
import Headers from './setHeaders'
import socket from "../websocket/webSocket"
import { UserStore } from '../flux'

const baseurl = process.env.REACT_APP_BASE_URL
const draftUrl = `${baseurl}/api/draft`
const publishUrl = `${baseurl}/api/blogs`
const categoryies = {design: false, development: false, writting: false, books: false}

const newPostPublished = async(newPost) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try{
        const response = await axios.post(publishUrl, newPost, config)
        const data = response.data
        socket.emit("notify", {
            categType: "New Post",
            title: data.title, 
            id: data.id, 
            postURL: `/blog?id=${data.id}${!data.backgroundImage ? '&ni=true': ''}`,
            author: data.author, 
            authorName: UserStore.getUserDetails().fullName,
            authorURL: `/user?id=${data.author}`,
            authorAvatar: UserStore.getUserDetails().authorAvatar,
            backgroundImage: data.backgroundImage
        })
        return response.data
    }
    catch(error){
        return {error: error.response.data.error}
    }
}

const getPostsPublished = async(pageNumber) => {
    const response = await axios.get(`${publishUrl}/${pageNumber}`)
    return response.data
}

const addNewPostDraft = async(newPost) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try{
        const response = await axios.put(draftUrl, newPost, config)
        return response.data
    } catch (error) {
        return {error: error.response.data.error}
    }
}

const deletePostDraft = async(id) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try {
        const response = await axios.delete(`${draftUrl}/${id}`, config)
        return response.data
    } catch(error) {
        return {error: error.response.data.error}
    }
}

const getPostsDraft = async(limit) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try {
        const response = await axios.get(`${draftUrl}/${limit}`, config)
        return response.data
    } catch(error) {
        return {error: error.response.data.error}
    }

}

const publishPostFromDraft = async(id) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try {
        const response = await axios.get(`${draftUrl}/publish/${id}`, config)
        return response.data
    } catch(error) {
        return {error: error.response.data.error}
    }

}

const blog = async(id, ni) => {
    try{
        const param = ni ? '/published/' : '/ipublished/'
        const response = await axios.get(`${publishUrl}${param}${id}`)
        return response.data
    }
    catch(error){
        return {error: "invalid id or ni"}
    }
}

const deleteBlog = async(id, ni) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }

    try{
        const param = ni ? '/published/' : '/ipublished/'
        const response = await axios.delete(`${publishUrl}${param}${id}`, config)
        return response.data
    }
    catch(error){
        return {error: error.response.data.error}
    }
}

const moveToDraft = async(id, ni) => {
    const details = await blog(id, ni)
    const category = details.category ? {...categoryies, [details.category]: true} : categoryies
    const response = await addNewPostDraft({...details, category: category})
    if(response.error){
        return response
    }
    return await deleteBlog(id, ni) 
}

const editBlog = async(id, ni, post) => {
    const config = Headers.setHeaders()

    if(!config) {
        return {}
    }
    try{
        const param = ni ? '/published/' : '/ipublished/'
        const response = await axios.put(`${publishUrl}${param}${id}`, post, config)
        return response.data
    }
    catch(error){
        return {error: "error occured"}
    }
}

const blogSearch = async(searchString, limit) => {
    const body = {value: searchString, limit: limit}
    try{
        const response = await axios.post(`${publishUrl}/search`, body)
        return response.data
    }
    catch(error){
        return []
    }
}

export default {
    newPostPublished,
    getPostsPublished,
    addNewPostDraft,  
    deletePostDraft,  
    getPostsDraft,
    publishPostFromDraft,
    blog,
    deleteBlog,
    moveToDraft,
    editBlog,
    blogSearch
}