import React, { useContext, useState } from 'react';
import { mainContext } from '../state/main/mainProvider';
import {Redirect} from 'react-router-dom';



const SessionForm = () => {

    const {state, setters} = useContext(mainContext);

    const [sessionError, setSessionError] = useState(null)

    const handleSubmit = e => {
        e.preventDefault()

        const sessionKey = document.getElementById("session-key").value.toLowerCase();

        if (["micah","duo","anna","ethan", 'umd', 'quinn'].includes(sessionKey)){
            setters.setSessionKey(sessionKey)
        } else {
            setSessionError("Sorry, that is not a valid session key")
        }

        console.log("SUBMITTED")
    }

    return state.sessionKey
        ? <Redirect to={"/"} />
        : (
        <form id="session-form" onSubmit={handleSubmit}>
            <label htmlFor={"session-key"}>Session Key</label>
            <br/>
            <input type="text" id="session-key" required />
            <br/>
            <input type={"submit"} />
            {
                sessionError
                &&
                <h3 style={{color: "red"}}>{sessionError}</h3>
            }
        </form>
    )

}

export default SessionForm;