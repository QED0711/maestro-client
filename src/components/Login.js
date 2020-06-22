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


    useEffect(() => {
        (state.clientID && !state.latency) && socket.emit(`sync`, {clientID: state.clientID})
    }, [state.clientID])

    return !state.role 
    ?
    (
        <div id="login">
            <button onClick={handleClick("conductor")}>
                Conductor
            </button>
            <button onClick={handleClick("player")}>
                Performer
            </button>
            
            <br/>

            {
                !state.latency
                    ? "Synchronizing with server..."
                    : "Synchronization established"
            }
        </div>
    )
    :
    <Redirect to={`/${state.role}`}/>

}

export default Login;