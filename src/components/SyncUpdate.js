import React, { useEffect, useContext } from 'react';

// =============================== STATE ===============================
import { mainContext } from '../state/main/mainProvider';

// =============================== SOCKETS ===============================
import socket from '../helpers/socket';


const SyncUpdate = () => {

    const {state, setters} = useContext(mainContext);

    useEffect(() => {
        if(state.clientID && !state.latency){
            socket.emit("clientPing", {clientID: state.clientID})
        }
    },[state.clientID])

    return (
        <div>
            {
                !state.latency 
                    ? <>Determining Latency from Server...</>
                    : <>Latency: {state.latency}</>
            }
        </div>
    )

}

export default SyncUpdate;