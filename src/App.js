import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import {mainContext} from './state/main/mainProvider';

import socket from './helpers/socket';
import synth from './helpers/synth'

import Metronome from './components/Metronome';
import Ping from './components/Ping';
import regressor from './helpers/regression';
import SyncUpdate from './components/SyncUpdate';
import MeasureStats from './components/MeasureStats';

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

      socket.on("play", data => {
        const latency = methods.getLatency()
        const startTime = data.startTime - latency;
        let numBeats = 0;
        let nextBeat = startTime;

        const metronome = setInterval(function(){
          // clear the interval if we have reached the end of the num beats
          if(numBeats >= 32) clearInterval(metronome);

          if(Date.now() >= nextBeat){
            // synth.triggerAttackRelease("C4", "8n");
            if(Date.now() !== nextBeat) console.log(Date.now() - nextBeat)
            nextBeat = nextBeat + 500
            numBeats += 1
            setters.incrementCount()
          }
        }, 1)

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
  
  const handleSingle = e => {
    socket.emit("single", {})
  }

  

    return (
      <div className="App">
        Client ID: {state.clientID}
        <SyncUpdate />
        
        <br/>
        {
          !!state.latency
          &&
          <button onClick={handleSingle}>
            Play Single
          </button>
        }
        <br/>
        {
          !!state.latency
          &&
          <button onClick={handlePlay}>
            PLAY
          </button>
        }
        <br/>

        <MeasureStats count={state.count}/>

      </div>
    );
  


}

export default App;
