import socketIOClient from 'socket.io-client';
const SERVER = "http://192.168.1.217:5000"

const socket = socketIOClient(SERVER)

export default socket;