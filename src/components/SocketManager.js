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

// =========================== HELPERS ===========================
import parseQueryString from '../helpers/parseQueryString'

const SocketManager = ({ children, context }) => {

    const { state, setters, methods } = context



    useEffect(() => {


        // const queryParams = parseQueryString(window.location.search)

        // set the clientID if it has not been set
        !state.clientID && setters.setClientID(Date.now())
        console.log(state.clientID, state.sessionKey)
        // setup socket actions here
        if (state.clientID && state.sessionKey) {
            console.log("SOCKETS CREATED")
            // custom ping interval
            socket.emit("client-ping", { clientID: state.clientID })
            setInterval(() => {
                socket.emit("client-ping", { clientID: state.clientID })
            }, 5000)

            socket.on(`time-pong-${state.clientID}`, data => {
                // setters.appendLatencyPing({serverTime: data.time, clientTime: Date.now()})
                setters.appendLatencyPing({ serverTime: data.time, clientTime: (performance.timeOrigin + performance.now()) })
            })

            // socket.on(`sync-${state.clientID}`, data => {
            //     // setters.appendLatencyPing({ ...data, clientTime: Date.now() })
            //     setters.appendLatencyPing({ ...data, clientTime: performance.now() })
            // })

            socket.on(`syncComplete-${state.clientID}`, data => {
                setters.calcAndSetLatency()
                console.log("sync-complete")
            })



            // STOP METRONOME
            socket.on(`execStop-${state.sessionKey}`, data => {
                setters.setPlayActive(false)
            })


            socket.on(`execPingPlayer-${state.sessionKey}`, data => {

                if (data.player === methods.getPlayer()) {
                    const latency = methods.getLatency()
                    const latencyPings = methods.getLatencyPings()
                    const latencyVariance = methods.getLatencyVariance()
                    const currentTime = Date.now()

                    const timeReceived = currentTime + latency
                    const player = methods.getPlayer()

                    socket.emit("report_player_ping_received", {
                        sessionKey: state.sessionKey,
                        timeSent: data.time,
                        timeReceived,
                        player,
                        latency,
                        latencyPings,
                        latencyVariance
                    })
                }
            })


            socket.on(`execReportPlayerPing-${state.sessionKey}`, data => {
                if (methods.getRole() === "conductor") {
                    const { player, roundtrip, latencyPings, latencyVariance } = data
                    setters.setPlayerLatencyInfo({ player, roundtrip, playerLatencyPings: latencyPings, playerLatencyVariance: latencyVariance })
                }
            })

            socket.on(`execResetPlayer-${state.sessionKey}`, data => {
                const player = methods.getPlayer()
                data.player === player && setters.resetLatency()
            })

            socket.on(`return-travel-time-${state.clientID}`, data => {
                console.log("RECEIVED TRAVEL TIME")
                const trueLatency = (Date.now() - data.time) / 2
                setters.setTrueLatency(trueLatency)

            })


            socket.on(`execCue-${state.sessionKey}`, async data => {
                
                console.log("EXECUTING CUE")
                const now = performance.now()
                const timeOrigin = performance.timeOrigin

                let trueLatency;

                const experimentalMode = methods.getExperimentalMode();
                
                if(experimentalMode){
                    trueLatency = await new Promise(resolve => {
                        socket.emit("request-travel-time", data, function(data){
                            resolve((performance.now() - now) / 2)
                        })
                    })
                }

                console.log({trueLatency})
                // experimentalMode && socket.emit("request-travel-time", { /* clientID: state.clientID, time: timeOrigin + now */ }, function(data){
                //     localTrueLatency = (performance.now() - now) / 2
                //     console.log(localTrueLatency)
                //     debugger
                // })

                
                let { cue, startMeasure, delay, delayAdjustments, repeatStart = 0, tempoShift = 1, } = data;
                const player = methods.getPlayer();
                const latency = methods.getLatency();

                // const trueLatency = experimentalMode ? await methods.getTrueLatency() : null;
                // console.log({ trueLatency, delay, performance: timeOrigin + now, now })
                // console.log({ delayAdjustments })

                // calculate start time
                let startTime;
                if (experimentalMode) {
                    startTime = player
                        ? (timeOrigin + now) + delay - trueLatency + delayAdjustments[player]
                        : (timeOrigin + now) + delay - trueLatency
                } else {
                    startTime = player
                        ? (timeOrigin + now) + delay + delayAdjustments[player]
                        : (timeOrigin + now) + delay
                }

                setters.setPlayActive(true)
                
                // variable initialization
                let nextTick;
                if(experimentalMode){
                    nextTick = startTime;
                } else {
                    nextTick = startTime - latency;
                }
                
                // console.log({startTime, nextTick, diff: nextTick - timeOrigin + now})
                let currentCue;

                let measureTicks;
                let currentTick = 1;
                let currentBeat = 1;

                // find the appropriate starting measure
                let currentMeasure = 0 // array index

                if (startMeasure) {
                    // we use "==" because we do want it to handle a conversion between strings and nums if necessary
                    currentMeasure = cueTest[cue].findIndex(measure => measure.measureNum == startMeasure);
                    currentMeasure = currentMeasure >= 0 ? currentMeasure : 0;
                }

                let currentBPM,
                    tempoAdjustment,
                    stopAdjustment;


                console.log(nextTick - timeOrigin + performance.now())
                // if(nextTick < timeOrigin + performance.now()) debugger
                const cueInterval = setInterval(() => {
                    if (methods.getPlayActive()) {
                        // console.log( // try switching back over to Date.now for timing function (especially in creation of nextTick)
                        //     timeOrigin + performance.now(),
                        //     nextTick,
                        //     Date.now(),
                        //     (timeOrigin + performance.now()) >= nextTick
                        //     )
                        if ((performance.timeOrigin + performance.now()) >= nextTick) {

                            const isMuted = methods.getIsMuted();

                            currentCue = cueTest[cue][currentMeasure]
                            measureTicks = currentCue.totalTicks

                            tempoAdjustment = currentCue.tempoAdjustment || 0
                            stopAdjustment = currentCue.stopAdjustment || measureTicks


                            currentBPM = !tempoAdjustment ? currentCue.subBPM : currentBPM ? currentBPM : currentCue.subBPM

                            // set the parameters for the metronome display
                            setters.setCueDisplay_numBeats(currentCue.beats)
                            setters.setCueDisplay_numSubdivisions(measureTicks)

                            // beat cases
                            switch (true) {
                                case currentTick === 1: // first beat = 1
                                    !isMuted && synth.triggerAttackRelease(500, "32n"); // downbeat
                                    // synth.triggerAttackRelease(1000, "32n"); // normal beat
                                    currentBeat++
                                    break;
                                case currentCue.beats.includes(currentTick): // normal beat
                                    !isMuted && synth.triggerAttackRelease(1000, "32n");
                                    currentBeat++
                                    break;
                                default: // subdivision
                                    !isMuted && synth.triggerAttackRelease(1500, "32n");
                            }

                            // tempo adjustments are locked at the beat level (not subdivision)
                            if (currentBeat <= stopAdjustment) currentBPM = currentBPM + tempoAdjustment

                            // set current state of the beat and subdivision counts
                            setters.setCueDisplay_currentMeasure(currentCue.measureNum)
                            setters.setCueDisplay_currentBeat(currentBeat - 1)
                            setters.setCueDisplay_currentSubdivision(currentTick)
                            setters.setCueDisplay_bpm(currentBPM)

                            nextTick = nextTick + ((60000 / currentBPM) / tempoShift)


                            if (currentCue.fermata === currentBeat) {
                                // because the "nextTick" is actually the next subdivision tick, we divide the duration of the fermata by how many subdivisions there are in a single beat to get the desired duration over the entire beat. Effectively, each subdivision adds the same time to the beat, and they all add up to the target fermata duration. 
                                nextTick += (currentCue.fermataDuration / currentCue.subdivision)
                            }

                            if (currentTick === measureTicks) { // we've reached the end of the measure, reset
                                if (currentMeasure.stopAdjustment) currentBPM = null;
                                // only progress to next measure if repeatStart is 0
                                repeatStart === 0 ? currentMeasure++ : repeatStart--

                                currentTick = 1
                                currentBeat = 1
                            } else {
                                currentTick++
                            }

                            if (currentMeasure === cueTest[cue].length) clearInterval(cueInterval)
                        }
                    } else {
                        clearInterval(cueInterval)
                    }

                }, 1)
            })



            // ================================== PLAYER CUES ==================================
            socket.on(`execPlayerCue-${state.sessionKey}`, data => {
                const player = methods.getPlayer();

                if (player === data.player) setters.setPlayerCued(true)
            })

            socket.on(`execPlayerCueStop-${state.sessionKey}`, data => {
                const player = methods.getPlayer();

                if (player === data.player) setters.setPlayerCued(false)

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



    }, [state.clientID, state.sessionKey])

    return <>{children}</>

}

export default subscribe(SocketManager, [
    { context: mainContext, dependencies: ["clientID", "sessionKey"] }
])