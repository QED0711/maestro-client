import React, {useContext, useEffect} from 'react';
import {Redirect} from 'react-router-dom';

// =============================== STATE ===============================
import { mainContext } from '../state/main/mainProvider';

const PlayerContainer = () => {

    const {state, setters} = useContext(mainContext);

    useEffect(() => {
        
    }, [])

    return state.role === "player"
    ?
    (
        <div id="player-container" className="container">
            PLAYER CONTAINER
        </div>
    )
    :
    <Redirect to="/" />

}

export default PlayerContainer;