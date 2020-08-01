import React, { useContext } from 'react';
import { mainContext } from '../../state/main/mainProvider';

const CueReceiver = ({player}) => {

    const {state} = useContext(mainContext)

    return (
            <div id="cue-receiver" className={`cue-receiver-active-${state.playerCued}`}>
                CUE
            </div>
    )

}

export default CueReceiver;