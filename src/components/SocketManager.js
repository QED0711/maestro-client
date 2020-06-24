import React, { useContext, useEffect } from 'react'

// ========================== STATE ==========================
import { mainContext } from '../state/main/mainProvider'
import { subscribe } from 'multistate'

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
                let {bpm, subdivision, startTime} = data;

                setters.setPlayActive(true)
                
                const latency = methods.getLatency()
                startTime = startTime - latency;
                let nextBeat = startTime;

                const metronome = setInterval(() => {
                    if(methods.getPlayActive()){
                        if(Date.now() >= nextBeat){
                            console.log("HELLO WORLD")
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