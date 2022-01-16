import axios from 'axios'
import Headers from './setHeaders'

const baseUrl = 'http://localhost:3001/api/user'

const createAccount = async(newUser) => {
    const response = await axios.post(baseUrl, newUser)
    sessionStorage.setItem("token", `bearer ${response.data.token}`)
    sessionStorage.setItem("userId", response.data.id)
    delete response.data.token
    return response.data
}

const login = async(userCredentials) => {
    try{
        const response = await axios.post(baseUrl + '/login', userCredentials)
        sessionStorage.setItem("token", `bearer ${response.data.token}`)
        sessionStorage.setItem("userId", response.data.id)
        delete response.data.token
        return response.data
    }
    catch(error){
        return {error: "Email or password invalid"}
    }
}

const userDetails = async() => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.get(baseUrl, config)
    return response.data
}

const updateUserDetails = async(updates) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    const response = await axios.put(baseUrl, updates, config)
    return response.data
}

const detailsOfAll = async() => {
    const response = await axios.get(baseUrl + '/all')
    return response.data
}

export default {createAccount, login, userDetails, updateUserDetails, detailsOfAll}