
const state = {

    audioContextLoaded: false,
    experimentalMode: true,

    clientID: null,
    sessionKey: null,
    // sessionKey: "alpha-test",
    role: null,


    playActive: false,
    isMuted: false,

    latencyPings: [],
    runningLatencySum: 0,
    numLatencyPings: 0,
    latencyVariance: null,
    latency: null,

    trueLatency: null,

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
    playerLatencyPings: null,
    playerLatencyVariance: null,

    activeCues: []

}

export default state;
