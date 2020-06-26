import React, { useContext, useEffect, useState } from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import './css/metronome-display.css';

import { mainContext } from './state/main/mainProvider';

import socket from './helpers/socket';
import synth from './helpers/synth'

// =========================== CHILDREN ===========================

import Metronome from './components/Metronome';
import Ping from './components/Ping';
import regressor from './helpers/regression';
import SyncUpdate from './components/SyncUpdate';
import MeasureStats from './components/MeasureStats';
import ConductorContainer from './components/conductor/ConductorContainer';
import PlayerContainer from './components/PlayerContainer';
import Login from './components/Login';
import SocketManager from './components/SocketManager';


const App = () => {
  const { state, setters, methods } = useContext(mainContext);

  useEffect(() => {
    var context;
    function init() {
      try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        console.log("Audio context loaded", context)
        setters.setAudioContextLoaded(true)
      }
      catch (e) {
        alert('Web Audio API is not supported in this browser');
      }
    }
    init()
    // window.addEventListener('load', init, false);
  }, [])

  const handlePlay = e => {
    socket.emit("start-performance", { delay: 3000 })
  }

  const handleSingle = e => {
    socket.emit("single", {})
  }

  const handleInitAudioClick = e => {
    synth.triggerAttackRelease("C4", "4n");
  }

  return (
    <SocketManager>
      <div className="App">
        {state.audioContextLoaded && "Audio Context Loaded"}
        <button onClick={handleInitAudioClick}>Test Audio</button>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/conductor">
              <ConductorContainer />
            </Route>
            <Route exact path="/player">
              <PlayerContainer />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </SocketManager>
  );



}

export default App;
