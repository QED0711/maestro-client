import React, { useContext } from 'react'
import { mainContext } from '../state/main/mainProvider'

const TopBanner = () => {
    const { state, setters } = useContext(mainContext)

    // EVENTS
    const handleResetClick = e => {
        setters.resetLatency();
    }

    return (
        <div id="top-banner">
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
        </div>
    )
}

export default TopBanner