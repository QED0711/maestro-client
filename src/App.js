import React, { useContext, useEffect, useState } from 'react';

import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './App.css';

import {mainContext} from './state/main/mainProvider';

import socket from './helpers/socket';
import synth from './helpers/synth'

import Metronome from './components/Metronome';
import Ping from './components/Ping';
import regressor from './helpers/regression';
import SyncUpdate from './components/SyncUpdate';
import MeasureStats from './components/MeasureStats';
import ConductorContainer from './components/ConductorContainer';
import PlayerContainer from './components/PlayerContainer';
import Login from './components/Login';

const App = () => {
  const {state, setters, methods} = useContext(mainContext);

  

  useEffect(() => {

    // set the clientID if it has not been set
    !state.clientID && setters.setClientID(Date.now())

    // setup socket actions here
    if(state.clientID){
      socket.on(`sync-${state.clientID}`, data => {
        setters.appendLatencyPing({...data, clientTime: Date.now()})
      })

      socket.on(`syncComplete-${state.clientID}`, data => {
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
            nextBeat = nextBeat + Math.round(60000 / 72) // 100 is the BPM
            if(numBeats === 4) numBeats = 0;
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
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/conductor">
              <ConductorContainer/>
            </Route>
            <Route exact path="/player">
              <PlayerContainer />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  


}

export default App;
