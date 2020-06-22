import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';

// =============================== STATE ===============================
import { mainContext } from '../state/main/mainProvider';

const ConductorContainer = () => {

    const {state, setters} = useContext(mainContext);



    return state.role === "conductor"
    ?
    (
        <div id="conductor-container" className="container">
            CONDUCTOR CONTAINER
        </div>
    )
    :
    <Redirect to="/" />

}

export default ConductorContainer;