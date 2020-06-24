import React, { useContext } from 'react';

import socket from '../../helpers/socket'

// ============================= STATE =============================
import { mainContext } from '../../state/main/mainProvider';

// ============================= CHILDREN =============================
import { Section } from '../ui';


const ConfigMetronome = () => {

    const {state} = useContext(mainContext)

    const handleStartClick = e => {
        let bpm = parseInt(document.getElementById("bpm").value)
        let subdivision = parseInt(document.getElementById("subdivision").value)

        bpm = bpm < 1 ? 1 : bpm
        subdivision = subdivision < 1 ? 1 : subdivision

        socket.emit("metronome", {
            bpm, 
            subdivision: subdivision,
            sessionKey: state.sessionKey
        })
    }

    const handleStopClick = e => {
        socket.emit("stop", {sessionKey: state.sessionKey})
    }

    return (
        <Section>
            <label htmlFor={"bpm"}>BPM</label>
            <input id="bpm" type="number" min="1" max="200" step="1" defaultValue="60" required/>
            <br/>
            
            <label htmlFor={"subdivision"}>Subdivision</label>
            <input id="subdivision" type="number" min="1" max="12" step="1" defaultValue="1" required />
            <br/>
            <button onClick={handleStartClick}>Start</button>
            <button onClick={handleStopClick}>Stop</button>
            
        </Section>
    )

}

export default ConfigMetronome;