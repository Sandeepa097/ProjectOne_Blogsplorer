import axios from 'axios'
import Headers from './setHeaders'

const baseurl = process.env.REACT_APP_BASE_URL
const logurl = `${baseurl}/activities`

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

export default {
    getLogs
}