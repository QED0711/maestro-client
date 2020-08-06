
const fs = require("fs");
const { start } = require("repl");

class Cue {
    constructor() {
        this.cueSheet = {};
    }

    static genMeasure(subBPM = 120, division = [2, 2, 2, 2]) {
        let beats = [1,];

        for (let i = 0; i < division.length - 1; i++) {
            beats[i + 1] = beats[i] + division[i]
        }

        return {
            subBPM,
            beats,
            totalTicks: division.reduce((a, b) => a + b)
        }
    }

    append(cue, measure, options) {
        let { repeat, measureNum, measures } = options;
        repeat = repeat || 1;
        measureNum = measureNum || 1;


        this.cueSheet[cue] = this.cueSheet[cue] || []; // initialize the cue if not already added

        if (!!measures) { // if the user indicated a measure list

            for (let measureNum of measures) {
                this.cueSheet[cue].push({ ...measure, measureNum })
            }

        } else { // if the user just indicated a starting measure
            for (let i = measureNum; i < measureNum + repeat; i++) {
                this.cueSheet[cue].push({
                    parts: ["*"],
                    measureNum: i,
                    ...measure,
                })
            }
        }

    }


    addTempoAdjustment(cue, fromTempo, toTempo, overNumTicks, options = {}) {

        /* 
        This method mutates the instance's cueSheet to add tempo adjustments
        */

        // 1. get the cue list 
        cue = this.cueSheet[cue]
        let { startMeasure } = options;

        // 3a. initialization
        startMeasure = startMeasure ? startMeasure - 1 : 0;

        // 3b. Calculate the total change and the per-beat change
        const totalChange = toTempo - fromTempo;
        const adjustment = totalChange / overNumTicks;

        let ticksLeft = overNumTicks;

        // 4. apply tempo adjustments to appropriate measures
        for (let [i, measure] of Object.entries(cue)) {

            // haven't reached the target start measure yet, continue
            if (i < startMeasure) continue;

            // if there are still beats to adjust...
            if (ticksLeft >= measure.totalTicks) {
                measure.tempoAdjustment = adjustment
                ticksLeft -= measure.totalTicks
            } else {
                measure.tempoAdjustment = adjustment
                measure.stopAdjustment = ticksLeft;
                ticksLeft = 0;
            }

            // if we have adjusted all beats
            if (ticksLeft === 0) break;
        }
    }

    addFermata(cue, options = {}) {
        cue = this.cueSheet[cue]

        const { measure, beat, duration } = options;

        cue[measure - 1].fermata = beat
        cue[measure - 1].fermataDuration = duration
    }


    save(path = "./cueSheet.json") {
        fs.writeFileSync(path, JSON.stringify(this.cueSheet))
    }
}


// =============================== TEST ===============================

const cue = new Cue();

// cue.append("cueA", { subBPM: 120, beats: [1, 3, 5, 7], totalTicks: 8 }, { repeat: 4 })

/* 
.append(
    cue id <string>
    measure <Cue.genMeasure>
    options: {
        measureNum <int>, 
        measures <array: int || string>, 
        repeat <int>
    }
)
*/

/* 
Cue.genMeasure(
    subdivision tempo <int>
    beat division <array: int>
)
 */
cue.append("cueA", Cue.genMeasure(240, [3, 3]), {measureNum: 1})
cue.append("cueA", Cue.genMeasure(240, [3, 2, 2]), {measureNum: 2, repeat: 5})
cue.append("cueA", Cue.genMeasure(240, [2, 2, 2, 2]), {measureNum: 7, repeat: 3})

// cue.addTempoAdjustment("cueA", 120, 240, 12, { startMeasure: 1 })




cue.save("./src/generatedCueSheet.json")



/*
{
    "cueA": [
        {
            "parts": [
                "*"
            ],
            "measureNum": 1,
            "subBPM": 240,
            "beats": [1, 5, 9, 13],
            "totalTicks": 16,
            "tempoAdjustment": 0.75
        },
        {
            "parts": [
                "*"
            ],
            "measureNum": 2,
            "subBPM": 240,
            "beats": [1, 5, 9, 13],
            "totalTicks": 16,
            "tempoAdjustment": 0.75
        },
        {
            "parts": [
                "*"
            ],
            "measureNum": 3,
            "subBPM": 144,
            "beats": [1, 3, 5, 7],
            "totalTicks": 8
        }
    ]
}
*/