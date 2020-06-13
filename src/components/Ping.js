import React, {useContext, useEffect} from 'react'
import { mainContext } from '../state/main/mainProvider';

import socket from '../helpers/socket';

const Ping = () => {

    const {state, setters} = useContext(mainContext);

    const handlePingClick = e => {
        console.log("PING")
        socket.emit("clientPing", {clientID: state.clientID})
    }

    useEffect(() => {
        if(!!state.model){
            const pred = state.model.transform([Date.now()])
            console.log(pred)
        }
    })

    return (
        <div id="ping">
            <button onClick={handlePingClick}>
                Ping
            </button>
            <br/>
            <span>serverTime</span>
            ,
            <span>clientTime</span>
            {state.latencyPings.map((p, i) => {
                return(
                    <div key={i}>
                        <span>{p.serverTime}</span>
                        , 
                        <span>{p.clientTime}</span>
                    </div>
                )
            })}
        </div>
    )

}

export default Ping;