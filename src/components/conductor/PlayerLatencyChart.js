import React, { useState, useContext } from 'react';
import { mainContext } from '../../state/main/mainProvider';

// ============================== SOCKET ==============================
import socket from '../../helpers/socket';

// ============================== CHILDREN ==============================
import {LineChart} from 'react-easy-chart';

const PlayerLatencyChart = ({closeChart, selectedPlayer}) => {

    const {state} = useContext(mainContext);
    const [hoveredPoint, setHoveredPoint] = useState(null)

    const formatData = (data) => {
        return data.map((dataPoint, i) => {
            return {x: i, y: dataPoint}
        })
    }

    const handleHoverPoint = (d,e) => {
        setHoveredPoint(d.y)
    }

    const handleResetClick = e => {
        socket.emit("reset_player", {player: selectedPlayer, sessionKey: state.sessionKey})
        closeChart()
    }

    return (
        <div className="player-latency-chart">
            <h3>{selectedPlayer}</h3>
            {<p>Variance: {state.playerLatencyVariance.toFixed(5)}</p>}
            <LineChart 
                data={[formatData(state.playerLatencyPings)]}
                dataPoints
                mouseOverHandler={handleHoverPoint}
                axes
                width={window.innerWidth - 100}
                yTicks={4}
            />
            {hoveredPoint && <p>Latency: {hoveredPoint}</p>}
            <br/>
            <button onClick={closeChart}>Close</button>
            <button onClick={handleResetClick}>Rest</button>
        </div>
    )

}

export default PlayerLatencyChart;