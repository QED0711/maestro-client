import React, { useContext, useEffect } from 'react'

// ========================== STATE ==========================
import { mainContext } from '../state/main/mainProvider'
import { subscribe } from 'multistate'

// ========================== SOCKET ==========================
import socket from '../helpers/socket'

// ========================== SYNTH ==========================
import synth from '../helpers/synth'

// =========================== CUE TEST ===========================
// import cueTest from '../cueSchema.json';
import cueTest from '../generatedCueSheet.json';

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

            // CUE TEST
            socket.on(`execCue-${state.sessionKey}`, data => {
                
                const { cue, parts } = data;
                const startTime = Date.now() + 1000 // start in 1 second

                setters.setPlayActive(true)

                let nextBeat = startTime;

                let currentMeasure = 0
                let currentCue;

                let measureTicks;
                let currentTick = 1;
                let currentBeat = 1;
                let mainBeats;
                
                let currentBPM, 
                    tempoAdjustment,
                    stopAdjustment;

                const cueInterval = setInterval(() => {
                    if (methods.getPlayActive()) {
                        if (Date.now() >= nextBeat) { 

                            currentCue = cueTest[cue][currentMeasure]
                            measureTicks = currentCue.totalTicks

                            // currentBPM = currentBPM || currentCue.bpm // default to cue bpm
                            // tempoAdjustment = currentCue.tempoAdjustment || 0 
                            // stopAdjustment = currentCue.stopAdjustment || currentCue.numBeats + 1

                            // set the parameters for the metronome display
                            setters.setCueDisplay_numBeats(currentCue.beats.length)
                            setters.setCueDisplay_numSubdivisions(measureTicks)


                            // beat cases
                            switch(true){
                                case currentTick === 1: // first beat = 1
                                    synth.triggerAttackRelease(500, "32n"); // downbeat
                                    synth.triggerAttackRelease(1000, "32n"); // normal beat
                                    currentBeat++
                                    // if(currentBeat <= stopAdjustment) currentBPM = currentBPM + tempoAdjustment
                                    break;
                                case currentCue.beats.includes(currentTick): // normal beat
                                    synth.triggerAttackRelease(1000, "32n");
                                    currentBeat++                                    
                                    break;
                                default: // subdivision
                                    synth.triggerAttackRelease(1500, "32n");
                            }

                            // set current state of the beat and subdivision counts
                            setters.setCueDisplay_currentMeasure(currentCue.measureNum)
                            setters.setCueDisplay_currentBeat(currentBeat)
                            setters.setCueDisplay_currentSubdivision(currentTick)


                            nextBeat = nextBeat + (60000 / currentCue.subBPM)

                            if(currentCue.fermata === currentBeat ){
                                // because the "nextBeat" is actually the next subdivision tick, we divide the duration of the fermata by how many subdivisions there are in a single beat to get the desired duration over the entire beat. Effectively, each subdivision adds the same time to the beat, and they all add up to the target fermata duration. 
                                nextBeat += (currentCue.fermataDuration / currentCue.subdivision)
                            } 

                            if(currentTick === measureTicks){ // we've reached the end of the measure
                                currentMeasure++     
                                currentTick = 1     
                                currentBeat = 1                      
                            } else{
                                currentTick++
                            }

                            if(currentMeasure === cueTest[cue].length) clearInterval(cueInterval)                            
                        }
                    } else {
                        clearInterval(cueInterval)
                    }

                }, 1)
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