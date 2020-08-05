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
    const handleCueClick = e => {
        e.preventDefault()
        socket.emit("playCue", {
            sessionKey: state.sessionKey, 
            cue, 
            delay: cueDelay * 1000, 
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
        <form id="cue-form" onSubmit={handleCueClick}>
            
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
            <button onDoubleClick={handleStopClick}>Stop</button>
        </form>
    )

}

export default CueForm;