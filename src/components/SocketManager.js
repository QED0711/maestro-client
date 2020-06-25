import React, { useContext, useEffect } from 'react'

// ========================== STATE ==========================
import { mainContext } from '../state/main/mainProvider'
import { subscribe } from 'multistate'

// ========================== SYNTH ==========================
import synth from '../helpers/synth'

import socket from '../helpers/socket'

const SocketManager = ({ children, context }) => {

    const { state, setters, methods } = context

    useEffect(() => {

        // set the clientID if it has not been set
        !state.clientID && setters.setClientID(Date.now())

        // setup socket actions here
        if (state.clientID) {

            socket.on(`sync-${state.clientID}`, data => {
                setters.appendLatencyPing({ ...data, clientTime: Date.now() })
            })

            socket.on(`syncComplete-${state.clientID}`, data => {
                setters.calcAndSetLatency()
                console.log("sync-complete")
            })


            socket.on(`execStop-${state.sessionKey}`, data => {
                setters.setPlayActive(false)
            })

            // METRONOME
            socket.on(`execMetronome-${state.sessionKey}`, data => {
                console.log(data)
                let { bpm, subdivision, startTime, numBeats } = data;

                if (methods.getPlayActive()) return // we don't want conflicting metronomes going

                setters.setPlayActive(true)

                const latency = methods.getLatency()
                startTime = startTime - latency;
                let nextBeat = startTime;

                let subCount = 1;
                let currentBeat = 1;

                const metronome = setInterval(() => {
                    if (methods.getPlayActive()) {
                        if (Date.now() >= nextBeat) {


                            switch (true) {
                                case subCount !== 1: // subdivision
                                    synth.triggerAttackRelease(1500, "32n");
                                    break;
                                case currentBeat === 1: // downbeat
                                    synth.triggerAttackRelease(500, "32n");
                                    break;
                                case subCount === 1: // normal beat
                                    synth.triggerAttackRelease(1000, "32n");
                                    break;
                            }

                            // reset subCount if it reaches its max level
                            if (subCount === subdivision) {
                                subCount = 1;
                                currentBeat++
                            } else {
                                subCount++
                            }
                            
                            // reset currentBeat if it reaches its max level
                            if (numBeats && currentBeat > numBeats) {
                                currentBeat = 1
                            }

                            nextBeat = nextBeat + (60000 / (bpm * subdivision))
                        }
                    } else {
                        clearInterval(metronome)
                    }
                }, 1)
            })


            socket.on("play", data => {
                const latency = methods.getLatency()
                const startTime = data.startTime - latency;
                let numBeats = 0;
                let nextBeat = startTime;

                const metronome = setInterval(function () {
                    // clear the interval if we have reached the end of the num beats
                    if (numBeats >= 32) clearInterval(metronome);

                    if (Date.now() >= nextBeat) {
                        // synth.triggerAttackRelease("C4", "8n");
                        if (Date.now() !== nextBeat) console.log(Date.now() - nextBeat)
                        nextBeat = nextBeat + Math.round(60000 / 72) // 100 is the BPM
                        if (numBeats === 4) numBeats = 0;
                        numBeats += 1
                        setters.incrementCount()
                    }
                }, 1)

            })



            socket.on("test", async data => {
                // synth.triggerAttackRelease("C4", "8n");
                console.log({ ...data, clientTime: Date.now() })
            })

        }



    }, [state.clientID])

    return <>{children}</>

}

export default subscribe(SocketManager, [
    { context: mainContext, dependencies: ["clientID"] }
])