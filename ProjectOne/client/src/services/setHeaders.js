const getToken = () => {
    return sessionStorage.getItem("token")
}
const getUserId = () => {
    return sessionStorage.getItem("userId")
}

const setHeaders = () => {
    const token = getToken()
    if(token === null) {
        return null
    }
    const config = {
        headers: {
            Authorization: token,
            UserId: getUserId()
        }
    }
    return config
}

export default {
    setHeaders
}