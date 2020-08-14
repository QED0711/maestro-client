
const state = {

    audioContextLoaded: false,

    clientID: null,
    sessionKey: "alpha-test",
    role: null,

    playActive: false,
    isMuted: false,

    latencyPings: [],
    runningLatencySum: 0,
    numLatencyPings: 0,
    latency: null,

    playerDelays: {},

    cueDelay: 2000,

    cueDisplay: {
        numBeats: null,
        numSubdivisions: null,
        currentMeasure: null,
        bpm: null,
        currentBeat: null,
        currentSubdivision: null,
        cue: null
    },

    player: null,
    playerCued: false,

    activeCues: []

}

export default state;
