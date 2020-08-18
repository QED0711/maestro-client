import React, { useContext } from 'react';
import { mainContext } from '../../state/main/mainProvider';

const PlayerSelection = () => {

    const {setters} = useContext(mainContext);

    const handlePlayerSelect = player => e => {
        setters.setPlayer(player)
    }

    return (
        <div id="player-selection">
            <h1 className="panel-title">Select Your Part</h1>
            <button className="player-selection-button" onClick={handlePlayerSelect("clarinet")} >Clarinet</button>
            <button className="player-selection-button" onClick={handlePlayerSelect("violin")} >Violin</button>
            <button className="player-selection-button" onClick={handlePlayerSelect("cello")} >Cello</button>
            <button className="player-selection-button" onClick={handlePlayerSelect("piano")} >Piano</button>
        </div>
    )

}

export default PlayerSelection;