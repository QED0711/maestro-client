import React, { useContext, useEffect, useState } from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './css/App.css';
import './css/login.css';
import './css/audio-controls.css';
import './css/cue-form.css';
import './css/metronome-display.css';
import './css/conductor-panel.css';
import './css/player-panel.css';

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
import AudioControls from './components/AudioControls';
import TopBanner from './components/TopBanner';
import SessionForm from './components/SessionForm';


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

    window.onkeydown = e => {


      try {
        if (e.ctrlKey) {


          if (e.key === "e") {
            e.preventDefault()
            document.getElementById("execute-cue-btn").click()
          }
          if (e.key === " " || e.key === "s") {
            e.preventDefault()
            document.getElementById("stop-cue-btn").click()
          }
          if (e.key === "m") {
            document.getElementById("mute-btn").click()
          }


          // player cues hotkeys
          const playerCues = document.getElementsByClassName("player-cue-button")
          for (let btn of playerCues) {
            if (btn.dataset.hotkey === e.key) {
              btn.click()
              break;
            }
          }
        }
      } catch (err) {
        // do nothing
      }



    }

  }, [])




  return (
    <SocketManager>
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/session">
              <SessionForm />
            </Route>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/conductor">
              <TopBanner />
              <AudioControls />
              <ConductorContainer />
            </Route>
            <Route exact path="/player">
              <TopBanner />
              <AudioControls />
              <PlayerContainer />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </SocketManager>
  );



}

export default App;
