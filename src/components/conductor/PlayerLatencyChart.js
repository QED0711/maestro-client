import React, { useState, useContext } from 'react';
import { mainContext } from '../../state/main/mainProvider';

import {LineChart} from 'react-easy-chart';

const PlayerLatencyChart = ({closeChart}) => {

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

    return (
        <div className="player-latency-chart">
            <LineChart 
                data={[formatData(state.playerLatencyPings)]}
                dataPoints
                mouseOverHandler={handleHoverPoint}
                axes
                width={window.innerWidth - 100}
                
            />
            {hoveredPoint}
            <br/>
            <button onClick={closeChart}>Close</button>
        </div>
    )

}

export default PlayerLatencyChart;