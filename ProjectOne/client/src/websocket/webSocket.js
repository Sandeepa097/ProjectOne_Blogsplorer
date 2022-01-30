import io from 'socket.io-client'

const ENDPOINT = process.env.REACT_APP_BASE_URL

export default io(ENDPOINT)