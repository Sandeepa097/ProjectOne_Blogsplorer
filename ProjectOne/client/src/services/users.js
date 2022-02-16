import axios from 'axios'
import Headers from './setHeaders'
import socket from "../websocket/webSocket"
import { UserStore } from '../flux'

const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/user`

const createAccount = async(newUser) => {
    try{
        const response = await axios.post(baseUrl, newUser)
        sessionStorage.setItem("token", `bearer ${response.data.token}`)
        sessionStorage.setItem("userId", response.data.id)
        delete response.data.token
        return response.data
    }
    catch(error){
        return {error: error.response.data.error}
    }
}

const login = async(userCredentials) => {
    try{
        const response = await axios.post(`${baseUrl}/login`, userCredentials)
        sessionStorage.setItem("token", `bearer ${response.data.token}`)
        sessionStorage.setItem("userId", response.data.id)
        delete response.data.token
        return response.data
    }
    catch(error){
        return {error: error.response.data.error}
    }
}

const userDetails = async() => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try{
        const response = await axios.get(baseUrl, config)
        return response.data
    } catch(error) {
        return {error: error.response.data.error}
    }
}

const updateUserDetails = async(updates) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try {
        const response = await axios.put(baseUrl, updates, config)
        socket.emit("notify", {
            categType: "Update",
            title: '', 
            postURL: `/user?id=${sessionStorage.getItem("userId")}`, 
            authorName: UserStore.getUserDetails().fullName,
            authorAvatar: UserStore.getUserDetails().authorAvatar,
        })
        return response.data
    } catch(error) {
        return {error: error.response.data.error}
    }

}

const detailsOfAll = async() => {
    const response = await axios.get(`${baseUrl}/all`)
    return response.data
}

const userTimeline = async(id) => {
    try{
        const response = await axios.get(`${baseUrl}/${id}`)
        return response.data
    }
    catch(error){
        return {error: error.response.data.error}
    }
}

const userSearch = async(searchString, limit) => {
    const body = {value: searchString, limit: limit}
    try{
        const response = await axios.post(`${baseUrl}/search`, body)
        return response.data
    }
    catch(error){
        return []
    }
}

export default {
    createAccount, 
    login, 
    userDetails, 
    updateUserDetails, 
    detailsOfAll, 
    userTimeline,
    userSearch
}