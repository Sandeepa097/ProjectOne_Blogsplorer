import axios from 'axios'
import Headers from './setHeaders'

const baseurl = process.env.REACT_APP_BASE_URL
const draftUrl = `${baseurl}/api/draft`
const publishUrl = `${baseurl}/api/blogs`
const categoryies = {design: false, development: false, writting: false, books: false}

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
    try{
        const param = ni ? '/published/' : '/ipublished/'
        const response = await axios.get(publishUrl + param + id)
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
        const response = await axios.delete(publishUrl + param + id, config)
        return response.data
    }
    catch(error){
        return {error: "invalid id or ni"}
    }
}

const moveToDraft = async(id, ni) => {
    const details = await blog(id, ni)
    const category = details.category ? {...categoryies, [details.category]: true} : categoryies
    await addNewPostDraft({...details, category: category})
    await deleteBlog(id, ni)
    
}

const editBlog = async(id, ni, post) => {
    const config = Headers.setHeaders()

    if(!config) {
        return {}
    }
    try{
        const param = ni ? '/published/' : '/ipublished/'
        const response = await axios.put(publishUrl + param + id, post, config)
        return response.data
    }
    catch(error){
        return {error: "error occured"}
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
    editBlog
}