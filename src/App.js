import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';

import socketIOClient from 'socket.io-client';

import * as Tone from "tone"
import { mainContext } from './state/main/mainProvider';

const synth = new Tone.Synth().toMaster();

//play a middle 'C' for the duration of an 8th note

const SERVER = "http://192.168.1.217:5000"

const socket = socketIOClient(SERVER)


function App() {
  
  const {state, setters} = useContext(mainContext)

  socket.on("test", data => {
    // synth.triggerAttackRelease("C4", "8n");
    // console.log
    setters.setCount(data.count)
    console.log(data.count, new Date().getTime() + ",")
  })
  const handleClick = e => {
    socket.emit("comm", {message: "This is a comm message from the client"})
  }
  
  const handleSingleClick = e => {
    socket.emit("single", {message: "This is a comm message from the client"})
  }
  
  return (
    <div className="App">
      <h1>COUNT: {state.count}</h1>
      <button onClick={handleClick} style={{margin: "20rem", transform: "scale(3)"}}>
        SEND COMM MESSAGE
      </button>
      <br/>
      <button onClick={handleSingleClick} style={{margin: "20rem", transform: "scale(3)"}}>
        SEND COMM MESSAGE
      </button>
    </div>
  );
}

export default App;
