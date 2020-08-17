import React, { useContext } from 'react';

// ============================= STATE =============================
import { mainContext } from '../state/main/mainProvider';

// ============================= HELPERS =============================
import synth from '../helpers/synth';



const AudioControls = () => {

    const {state, setters} = useContext(mainContext);

    const handleInitAudioClick = e => {
        synth.triggerAttackRelease("C4", "4n");
    }

    const handleMuteClick = e => {
        setters.setIsMuted(!state.isMuted)
    }

    return (
        <>
        <div id="audio-controls">
            
            <br/>
            <button onClick={handleInitAudioClick}>Test Audio</button>
            <button id="mute-btn" className={`is-muted-${state.isMuted}`} onClick={handleMuteClick}>
                {state.isMuted ? "Unmute" : "Mute"}
            </button>
        </div>
        </>
    )

}

export default AudioControls;