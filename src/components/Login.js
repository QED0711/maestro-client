import React, {useContext, useEffect} from 'react';
import { Redirect } from 'react-router-dom';

// ============================ STATE ============================
import { mainContext } from '../state/main/mainProvider';

// ============================ SOCKET ============================
import socket from '../helpers/socket'

const Login = () => {

    const {state, setters} = useContext(mainContext);

    const handleClick = role => e => {
        setters.setRole(role)
    }

    if(!state.sessionKey){
        return <Redirect to={"/session"}/>
    }

    return !state.role 
    ?
    (
        <div id="login">
            <button id="conductor-login" className="role-tab" onClick={handleClick("conductor")}>
                Conductor
            </button>
            <button id="player-login" className="role-tab" onClick={handleClick("player")}>
                Performer
            </button>
        </div>
    )
    :
    <Redirect to={`/${state.role}`}/>

}

export default Login;