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
            <button className="audio-control-btn" onClick={handleInitAudioClick}>Test Audio</button>
            <button id="mute-btn" className={`audio-control-btn is-muted-${state.isMuted}`} onClick={handleMuteClick} title={"(ctrl + M)"}>
                {state.isMuted ? "Unmute" : "Mute"}
            </button>
        </div>
        </>
    )

}

export default AudioControls;