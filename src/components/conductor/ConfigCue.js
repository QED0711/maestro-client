import React, { useContext } from 'react';
import { Section } from '../ui';

import socket from '../../helpers/socket'
import { mainContext } from '../../state/main/mainProvider';

import CueDisplay from './CueDisplay'
import PlayerCues from './PlayerCues';
import CueForm from './CueForm';

const ConfigCue = () => {

    // const {state, setters, methods} = useContext(mainContext);

    return (
        <Section>
            <CueForm />
            <CueDisplay />
            <PlayerCues />
        </Section>
    )

}

export default ConfigCue;