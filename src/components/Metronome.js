import React from 'react';

import socket from '../helpers/socket';
import synth from '../helpers/synth';


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const Metronome = () => {

    const handleSinglePitchClick = e => {
        socket.emit("single", {pitch: "play"})
    }

    const handleMultiplePitch = async e => {
        // socket.emit("multiple", {})
        for (let i = 0; i < 50; i++){
            synth.triggerAttackRelease("C4", "8n");
            await sleep(500);
        }
    }

    return (
        <div>
            <button onClick={handleSinglePitchClick}>
                Single Pitch
            </button>
            <button onClick={handleMultiplePitch}>
                Multiple Pitch
            </button>
        </div>
    )

}

export default Metronome;