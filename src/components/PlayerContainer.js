import React, {useContext, useEffect} from 'react';
import {Redirect} from 'react-router-dom';

// =============================== STATE ===============================
import { mainContext } from '../state/main/mainProvider';
import CueDisplay from './conductor/CueDisplay';
import CueReceiver from './player/CueReceiver';
import PlayerSelection from './player/PlayerSelection';

const PlayerContainer = () => {

    const {state, setters} = useContext(mainContext);

    useEffect(() => {
        
    }, [])

    return state.role === "player"
    ?
    (
        state.player 
        ? (
            <div id="player-container" className="container">
                <CueDisplay />
                <CueReceiver />
            </div>
        )
        : <PlayerSelection />
    )
    :
    <Redirect to="/" />

}

export default PlayerContainer;