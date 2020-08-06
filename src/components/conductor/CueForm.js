import React, {useContext, useState} from 'react';

import socket from '../../helpers/socket'
import { mainContext } from '../../state/main/mainProvider';

const CueForm = () => {

    const {state, setters, methods} = useContext(mainContext);

    const [cue, setCue] = useState("cueA")
    const [cueDelay, setCueDelay] = useState(2)
    const [startMeasure, setStartMeasure] = useState(null)
    const [repeatStart, setRepeatStart] = useState(0)
    const [tempoShift, setTempoShift] = useState(1)

    
    
    // EVENTS
    const handleCueSubmit = e => {
        e.preventDefault()
        console.log("SUBMITTED")
        
        // get delay adjustments for the individual player so we can pass that information to the socket server
        const playerDelays = document.getElementsByClassName("player-adjusted-delay")
        
        const delayAdjustments = {}
        for (let pd of playerDelays){
            delayAdjustments[pd.dataset.player] = parseInt(pd.value)
        }
        
        socket.emit("playCue", {
            sessionKey: state.sessionKey, 
            cue, 
            delay: cueDelay * 1000, 
            delayAdjustments,
            startMeasure, 
            repeatStart,
            tempoShift
        })
    }

    const handleCueChange = e => {
        setCue(e.target.value)
    }

    const handleDelayChange = e => {
        setCueDelay(parseFloat(e.target.value))
    }

    const handleStartMeasureChange = e => {
        setStartMeasure(e.target.value)
    }

    const handleRepeatStartChange = e => {
        setRepeatStart(parseInt(e.target.value))
    }

    const handleTempoShiftChange = e => {
        setTempoShift(parseFloat(e.target.value))
    }

    const handleStopClick = e => {
        socket.emit("stop", {sessionKey: state.sessionKey})
    }

    return (
        <>
        <form id="cue-form" onSubmit={handleCueSubmit}>
            
            <label>Cue ID</label><br/>
            <input type="text" value={cue} onChange={handleCueChange}/>
            <br/>
            <label>Start Delay</label><br/>
            <input type="number" value={cueDelay} onChange={handleDelayChange} step="0.1"/>
            <br/>
            <label>Start Measure</label><br/>
            <input type="text" value={startMeasure} onChange={handleStartMeasureChange}/>
            <br/>
            <label>Repeat Start Measure</label><br/>
            <input type="number" value={repeatStart} onChange={handleRepeatStartChange} step="1"/>
            <br/>
            <label>Tempo Shift</label><br/>
            <input type="number" value={tempoShift} onChange={handleTempoShiftChange} step="0.01"/>
            <br/>
            
            <input type="submit" value="Execute Cue" />
        </form>
        <button onDoubleClick={handleStopClick}>Stop</button>
        </>
    )

}

export default CueForm;