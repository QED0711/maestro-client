import React, { useContext } from 'react';

// ======================= STATE =======================
import { mainContext } from '../../state/main/mainProvider';

const CueDisplay = () => {

    const { state } = useContext(mainContext);

    const genBeatTicks = (numBeats, currentBeat) => {
        return new Array(numBeats).fill(1).map((beat, i) => {
            return (
                <div key={i} className={`beat-tick beat-tick-active-${currentBeat === i + 1}`}></div>
            )
        })
    }

    const genSubTicks = (numSubTicks, currentSub) => {
        return new Array(numSubTicks).fill(1).map((sub, i) => {
            return (
                <div key={i} className={`sub-tick sub-tick-active-${currentSub === i + 1}`}></div>
            )
        })
    }

    return (
        <div id="cue-display">
            <h1>{state.cueDisplay.currentMeasure || "--"}</h1>
            <h3>{state.cueDisplay.currentBeat || 1}</h3>
            <div className="beat-tick-container" style={{ gridTemplateColumns: `repeat(${state.cueDisplay.numBeats || 1}, 1fr)` }}>
                {genBeatTicks(state.cueDisplay.numBeats, state.cueDisplay.currentBeat)}
            </div>
            <div className="sub-tick-container" style={{ gridTemplateColumns: `repeat(${state.cueDisplay.numSubdivisions || 1}, 1fr)` }}>
                {genSubTicks(state.cueDisplay.numSubdivisions, state.cueDisplay.currentSubdivision)}
            </div>
        </div>
    )

}

export default CueDisplay;