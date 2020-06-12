import React from 'react';
import logo from './logo.svg';
import './App.css';

import socketIOClient from 'socket.io-client';

const SERVER = "http://192.168.1.217:5000"

const socket = socketIOClient(SERVER)

socket.on("test", data => {
  console.log(data.message)
})

function App() {
  
  const handleClick = e => {
    socket.emit("comm", {message: "This is a comm message from the client"})
  }
  
  return (
    <div className="App">
      <button onClick={handleClick} style={{margin: "20rem", transform: "scale(3)"}}>
        SEND COMM MESSAGE
      </button>
    </div>
  );
}

export default App;
