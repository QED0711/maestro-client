import React, { useContext, useState } from 'react';

import socket from '../../helpers/socket'

// ============================= STATE =============================
import { mainContext } from '../../state/main/mainProvider';

// ============================= CHILDREN =============================
import { Section } from '../ui';


const ConfigMetronome = () => {

    const {state} = useContext(mainContext)
    const [metered, setMetered] = useState(false)


    const handleStartClick = e => {
        let bpm = parseInt(document.getElementById("bpm").value)
        let subdivision = parseInt(document.getElementById("subdivision").value)

        bpm = bpm < 1 ? 1 : bpm
        subdivision = subdivision < 1 ? 1 : subdivision

        let meter;
        if(metered){
            const numerator = parseInt(document.getElementById("meter-numerator").value)
            const denominator = parseInt(document.getElementById("meter-denominator").value)
            meter = [numerator, denominator]
        } 

        socket.emit("metronome", {
            bpm, 
            subdivision: subdivision,
            sessionKey: state.sessionKey,
            meter
        })
    }

    const handleStopClick = e => {
        socket.emit("stop", {sessionKey: state.sessionKey})
    }

    const handleMeterToggle = e => {
        const val = e.target.checked;
        setMetered(val)
    }

    return (
        <Section>
            <label htmlFor={"bpm"}>BPM</label>
            <input id="bpm" type="number" min="1" max="200" step="1" defaultValue="60" required/>
            <br/>
            
            <label htmlFor={"subdivision"}>Subdivision</label>
            <input id="subdivision" type="number" min="1" max="12" step="1" defaultValue="1" required />
            <br/>


            <input id="metered-checkbox" type="checkbox" onChange={handleMeterToggle} />
            <label htmlFor={"metered-checkbox"}>Metered</label>

            <br/>

            {
                metered 
                &&
                <>
                <input id="meter-numerator" type="number" min="1" defaultValue="4" step="1" />
                <br/>
                <input id="meter-denominator" type="number" min="1" defaultValue="4" step="1" />
                <br/>
                </>
            }

            <button onClick={handleStartClick}>Start</button>
            <button onClick={handleStopClick}>Stop</button>
            
        </Section>
    )

}

export default ConfigMetronome;