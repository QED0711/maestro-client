import * as Tone from "tone"
const synth = new Tone.Synth(
    {
        oscillator: {
            type: 'fmsquare',
            modulationType: 'square',
            // modulationIndex: 3,
            harmonicity: 3.4
        },
        envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.1,
            release: 0.1
        }
    }
).toMaster();

export default synth;