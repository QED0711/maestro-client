import React, { useContext } from 'react';

// ======================= STATE =======================
import { mainContext } from '../../state/main/mainProvider';

const CueDisplay = () => {

    const { state } = useContext(mainContext);

    const genBeatTicks = (beats, currentBeat) => {
        beats = beats || [1]
        return new Array(beats.length).fill(1).map((beat, i) => {
            return (
                <div 
                    key={i} 
                    className={`beat-tick beat-tick-active-${currentBeat - 1 === i} prep-beat-active-${state.cueDisplay.currentMeasure === "PREP" && currentBeat - 1 === i}`}
                >                    
                </div>
            )
        })
    }

    const genSubTicks = (numSubTicks, currentSub) => {
        return new Array(numSubTicks).fill(1).map((sub, i) => {
            return (
                <div 
                    key={i} 
                    className={`sub-tick sub-tick-active-${currentSub === i + 1} prep-beat-active-${state.cueDisplay.currentMeasure === "PREP" && currentSub - 1 === i}`}
                >                    
                </div>
            )
        })
    }

    const spaceBeats = (beats, numSubTicks) => {
        beats = beats || [1]
        const spacing = []
        for(let i = 1; i <= beats.length; i++){
            if(i === beats.length){
                spacing.push(numSubTicks + 1 - beats[i - 1]);
                break;
            }
            spacing.push(beats[i] - beats[i - 1])
        }
        
        return spacing;
    }

    return (
        <div id="cue-display">
            {state.player && <p>{state.player}</p>}
            <h1>Measure: <strong>{state.cueDisplay.currentMeasure || "--"}</strong></h1>
            {/* <h3>{state.cueDisplay.bpm || 1}</h3> */}
            <h2>Beat: <strong>{state.cueDisplay.currentBeat || 1}</strong></h2>
            <div className="beat-tick-container" style={{ gridTemplateColumns: spaceBeats(state.cueDisplay.numBeats, state.cueDisplay.numSubdivisions).map(beat => beat + "fr").join(" ") }}>
                {genBeatTicks(state.cueDisplay.numBeats, state.cueDisplay.currentBeat)}
            </div>
            <div className="sub-tick-container" style={{ gridTemplateColumns: `repeat(${state.cueDisplay.numSubdivisions || 1}, 1fr)` }}>
                {genSubTicks(state.cueDisplay.numSubdivisions, state.cueDisplay.currentSubdivision)}
            </div>
        </div>
    )

}

export default CueDisplay;