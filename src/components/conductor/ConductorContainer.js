import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

// =============================== STATE ===============================
import { mainContext } from '../../state/main/mainProvider';
import { TabButton } from '../ui';


// =============================== CHILDREN ===============================
import ConfigMetronome from './ConfigMetronome';
import ConfigCue from './ConfigCue';

const ConductorContainer = () => {

    const { state, setters } = useContext(mainContext);

    const [tab, setTab] = useState("cue")


    const handleTabChange = tab => e => {
        setTab(tab)
    }

    return state.role === "conductor"
        ?
        (
            <div id="conductor-container" className="container">
                {/* <TabButton handleClick={handleTabChange("metronome")}>
                    Metronome
                </TabButton>

                <TabButton handleClick={handleTabChange("cue")}>
                    Cue Sheet
                </TabButton> */}


                {tab === "cue" && <ConfigCue />}
                {tab === "metronome" && <ConfigMetronome />}

            </div>
        )
        :
        <Redirect to="/" />

}

export default ConductorContainer;