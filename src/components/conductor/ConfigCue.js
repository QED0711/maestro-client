import React, { useContext } from 'react';
import { Section } from '../ui';

import socket from '../../helpers/socket'
import { mainContext } from '../../state/main/mainProvider';

import CueDisplay from './CueDisplay'

const ConfigCue = () => {

    const {state} = useContext(mainContext);

    const handleCueClick = e => {
        socket.emit("playCue", {sessionKey: state.sessionKey, cue: "cueA"})
    }

    return (
        <Section>
            <button onClick={handleCueClick}>Exec Cue</button>
            <CueDisplay />
        </Section>
    )

}

export default ConfigCue;