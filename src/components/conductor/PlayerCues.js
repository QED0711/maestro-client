import React, { useContext } from 'react';
import socket from '../../helpers/socket';
import { mainContext } from '../../state/main/mainProvider';


const PLAYERS = [
    "clarinet",
    "violin",
    "cello",
    "piano"
]


const PlayerCues = () => {

    const { state, methods } = useContext(mainContext);


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

        socket.emit("ping_player", {player, sessionKey: state.sessionKey})
    }

    // HELPERS
    const renderCueButtons = (players) => {
        return players.map((player, i) => {
            return (
                <button
                    className={`player-cue-button player-cue-button-active-${state.activeCues.includes(player)}`}
                    onClick={handlePlayerClick(player)}
                    onContextMenu={handlePlayerRightClick(player)}
                >
                    {player}
                    <br/>
                    {state.playerDelays[player]}
                </button>
            )
        })
    }

    return (
        <div id="player-cues">

            {/* <button className="player-cue-button" onClick={handlePlayerClick("clarinet")} >Clarinet</button>
            <button className="player-cue-button" onClick={handlePlayerClick("violin")} >Violin</button>
            <button className="player-cue-button" onClick={handlePlayerClick("cello")} >Cello</button>
            <button className="player-cue-button" onClick={handlePlayerClick("piano")} >Piano</button> */}
            {renderCueButtons(PLAYERS)}

        </div>
    )

}

export default PlayerCues