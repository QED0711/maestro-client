import React, { useContext } from 'react';
import { Section } from '../ui';

import socket from '../../helpers/socket'
import { mainContext } from '../../state/main/mainProvider';

import CueDisplay from './CueDisplay'
import PlayerCues from './PlayerCues';

const ConfigCue = () => {

    const {state, setters, methods} = useContext(mainContext);

    const handleCueClick = e => {
        socket.emit("playCue", {sessionKey: state.sessionKey, cue: "cueA", delay: state.cueDelay})
    }

    const handleDelayChange = e => {
        setters.setCueDelay(parseInt(e.target.value))
    }

    return (
        <Section>
            <button onClick={handleCueClick}>Exec Cue</button>
            <input type="number" value={state.cueDelay} onChange={handleDelayChange}/>
            <CueDisplay />
            <PlayerCues />
        </Section>
    )

}

export default ConfigCue;