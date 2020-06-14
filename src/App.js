import React, { useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import {mainContext} from './state/main/mainProvider';

import socket from './helpers/socket';
import synth from './helpers/synth'

import Metronome from './components/Metronome';
import Ping from './components/Ping';
import regressor from './helpers/regression';
import SyncUpdate from './components/SyncUpdate';

const App = () => {
  const {state, setters, methods} = useContext(mainContext);

  useEffect(() => {

    // set the clientID if it has not been set
    !state.clientID && setters.setClientID(Date.now())

    // setup socket actions here
    if(state.clientID){
      socket.on(`ping-${state.clientID}`, data => {
        setters.appendLatencyPing({...data, clientTime: Date.now()})
      })

      socket.on(`sync-complete-${state.clientID}`, data => {
        setters.calcAndSetLatency()
        console.log("sync-complete")
      })

      socket.on("play", async data => {
        const latency = methods.getLatency()
        const startTime = data.startTime - latency;
        console.log(latency)

        // while(true){
        //   if(Date.now() >= startTime) break;
        // }

        let numBeats = 1;
        // let currentTime = Date.now();
        let nextBeat = startTime;
        while(numBeats <= 32){
          // if the current time is equal to or greater than the next beat time we send a click and reset for the following click
          if (Date.now() >= nextBeat){            
            synth.triggerAttackRelease("C4", "8n");
            nextBeat = nextBeat + 500;
            // currentTime = Date.now();
            numBeats += 1
          } 
        }

      })

      socket.on("test", async data => {
        synth.triggerAttackRelease("C4", "8n");
        console.log({...data, clientTime: Date.now()})
      })

    }



  }, [state.clientID])

  
    const handlePlay = e => {
      socket.emit("start-performance", {delay: 3000})
    }

    return (
      <div className="App">
        Client ID: {state.clientID}
        <SyncUpdate />
        {/* <Metronome /> */}
        <br/>
        {
          !!state.latency 
          &&
        <>Latency: {state.latency}</>
        }
        {
          !!state.latency
          &&
          <button onClick={handlePlay}>
            PLAY
          </button>
        }
        {/* <Ping /> */}
      </div>
    );
  


}

export default App;
