import React, { useContext } from 'react'
import { mainContext } from '../state/main/mainProvider'

const TopBanner = () => {
    const { state, setters } = useContext(mainContext)

    // EVENTS
    const handleResetClick = e => {
        setters.resetLatency();
    }

    const handleExperimentalClick = e => {
        setters.setExperimentalMode(e.target.checked)
    }

    return (
        <div id="top-banner">
            <span className="banner-item">
                Session Key: {state.sessionKey}                
            </span>

            <span className="banner-item">
                <label>Audio Context Loaded</label>
                <input type={"checkbox"} checked={!!state.audioContextLoaded} />
            </span>

            <span className="banner-item">
                {state.latency && `Average Latency: ${state.latency}`}
            </span>

            <span className="banner-item">
                {state.latencyVariance && `Latency Variance: ${state.latencyVariance.toFixed(5)}`}
                <button id="reset-button" onClick={handleResetClick}>reset</button>
            </span>
            
            <span className="banner-item">
                <label>Experimental Features </label>
                <input type="checkbox" onChange={handleExperimentalClick} checked={state.experimentalMode} />
            </span>
        </div>
    )
}

export default TopBanner