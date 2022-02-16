import axios from 'axios'
import Headers from './setHeaders'

const baseurl = process.env.REACT_APP_BASE_URL
const logurl = `${baseurl}/activities`
const deleteurl = `${logurl}/delete/`

const getLogs = async(logType, pageNumber) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try{
        const response = await axios.get(`${logurl}/${logType}/${pageNumber}`, config)
        return response.data
    }
    catch(error){
        return {error: error.response.data.error}
    }
}

const deleteLog = async(logType) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
    try{
        const response = await axios.delete(`${deleteurl}${logType}`, config)
        return response.data
    }
    catch(error) {
        return {error: error.response.data.error}
    }
}

const deleteById = async(logType, id) => {
    const config = Headers.setHeaders()
    if(!config) {
        return {}
    }
        try{
        const response = await axios.delete(`${logurl}/${logType}/${id}`, config)
        return response.data
    }
    catch(error) {
        return {error: error.response.data.error}
    }
}

export default {
    getLogs,
    deleteLog,
    deleteById
}