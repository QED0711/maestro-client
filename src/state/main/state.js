
const state = {

    audioContextLoaded: false,

    clientID: null,
    sessionKey: "alpha-test",
    role: null,

    playActive: false,

    latencyPings: [],
    latency: null,

    cueDisplay: {
        numBeats: null,
        numSubdivisions: null,
        currentMeasure: null,
        bpm: null,
        currentBeat: null,
        currentSubdivision: null,
        cue: null
    }

}

export default state;
