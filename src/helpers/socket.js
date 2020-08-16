import socketIOClient from 'socket.io-client';

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || window.location.hostname;
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 5000

const SERVER = `http://${SERVER_HOST}:${SERVER_PORT}`

const socket = socketIOClient(SERVER)

export default socket;