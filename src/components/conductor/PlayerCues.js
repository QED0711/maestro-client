import React, { useContext, useEffect, useState } from 'react';
import socket from '../../helpers/socket';
import { mainContext } from '../../state/main/mainProvider';


import PlayerLatencyChart from './PlayerLatencyChart';

const PLAYERS = [
    "clarinet",
    "violin",
    "cello",
    "piano"
]


const PlayerCues = () => {

    const { state, setters, methods } = useContext(mainContext);
    
    const [selectedPlayerChart, setSelectedPlayerChart] = useState(null)
    // EVENTS
    const handlePlayerClick = player => e => {
        const playerCueActive = methods.getActiveCues().includes(player)

        playerCueActive
            ? socket.emit("cue_player_stop", { player, sessionKey: state.sessionKey })
            : socket.emit("cue_player", { player, sessionKey: state.sessionKey })

        methods.adjustActiveCues(player)
    }

    const handlePlayerRightClick = player => e => {
        e.preventDefault();
        setSelectedPlayerChart(player)
        socket.emit("ping_player", { player, sessionKey: state.sessionKey })
    }

    const handleCloseChart = e => {
        setters.setPlayerLatencyPings(null)
    }

    // HELPERS
    const renderCueButtons = (players) => {
        return players.map((player, i) => {
            return (
                <div className="player-cue-container" key={player}>

                    <button
                        className={`player-cue-button player-cue-button-active-${state.activeCues.includes(player)}`}
                        onClick={handlePlayerClick(player)}
                        onContextMenu={handlePlayerRightClick(player)}
                        data-hotkey={i + 1}
                    >
                        {player} ({i + 1})
                        <br />
                        {state.playerDelays[player]}
                    </button>

                    <br/>

                    <input className="player-adjusted-delay" type="number" data-player={player} step="1" defaultValue="0" max="99000" min="-99000" />
                </div>
            )
        })
    }

    return (
        <div id="player-cues">
            {renderCueButtons(PLAYERS)}
            {!!state.playerLatencyPings && <PlayerLatencyChart closeChart={handleCloseChart} selectedPlayer={selectedPlayerChart} />}
        </div>
    )

}

export default PlayerCues