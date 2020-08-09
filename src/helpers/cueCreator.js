
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
        // The user puts in the measure number, and we find the index of the cue that corresponds
        startMeasure = cue.findIndex(measure => measure.measureNum === startMeasure);
        startMeasure = startMeasure ? startMeasure : 0;

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


/* 
:::::::::::
:: CUE A ::
:::::::::::
*/
cue.append("A", Cue.genMeasure(116, [2, 2]), { measureNum: "PREP"})
cue.append("A", Cue.genMeasure(116, [2, 2, 2, 2]), { measureNum: 1, repeat: 6 })

// add fermata here for measure 7

/* 
:::::::::::
:: CUE B ::
:::::::::::
*/
cue.append("B", Cue.genMeasure(144, [3, 3]), { measureNum: "PREP"})
cue.append("B", Cue.genMeasure(144, [3, 3, 3]), { measureNum: 8, repeat: 2 })
cue.append("B", Cue.genMeasure(180, [3, 3, 3]), { measureNum: 10, repeat: 2 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 12 })
cue.append("B", Cue.genMeasure(180, [3, 2, 3]), { measureNum: 13 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 14 })
cue.append("B", Cue.genMeasure(180, [3, 3, 2]), { measureNum: 15 })
cue.append("B", Cue.genMeasure(180, [3, 3, 3]), { measureNum: 16, repeat: 2 })
cue.append("B", Cue.genMeasure(180, [3, 2, 3]), { measureNum: 18 })
cue.append("B", Cue.genMeasure(180, [3, 3, 3, 2]), { measureNum: 19, repeat: 3 })
cue.append("B", Cue.genMeasure(180, [3, 2, 3]), { measureNum: 22 })
cue.append("B", Cue.genMeasure(180, [3, 2, 2]), { measureNum: 23 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 24 })
cue.append("B", Cue.genMeasure(180, [3, 2]), { measureNum: 25 })
cue.append("B", Cue.genMeasure(180, [3, 3, 3, 2]), { measureNum: 26, repeat: 2 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 28, repeat: 4 })
cue.append("B", Cue.genMeasure(180, [2, 3, 2, 3]), { measureNum: 32 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 33 })
// accelerando
cue.append("B", Cue.genMeasure(180, [3, 3, 3]), { measureNum: 34 })
cue.append("B", Cue.genMeasure(216, [3, 3, 3]), { measureNum: 35 })
cue.append("B", Cue.genMeasure(216, [3, 3]), { measureNum: 36, repeat: 9 })
cue.append("B", Cue.genMeasure(216, [3, 3, 2]), { measureNum: 45, })
cue.append("B", Cue.genMeasure(216, [3, 3]), { measureNum: 46, repeat: 4 })
// ritardando
cue.append("B", Cue.genMeasure(216, [3, 3, 3]), { measureNum: 50 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 51 })
cue.append("B", Cue.genMeasure(180, [3, 3, 2]), { measureNum: 52 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 53 })
cue.append("B", Cue.genMeasure(180, [3, 3, 3]), { measureNum: 54 })
// ritardando
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 55 })
cue.append("B", Cue.genMeasure(180, [3, 2]), { measureNum: 56 })
cue.append("B", Cue.genMeasure(180, [3, 3]), { measureNum: 57, repeat: 4 })

// CUE B TEMPO ADJUSTMENTS

cue.addTempoAdjustment("B", 144, 180, 18, { startMeasure: 8 })
cue.addTempoAdjustment("B", 180, 216, 9, { startMeasure: 34 })
cue.addTempoAdjustment("B", 216, 180, 9, { startMeasure: 50 })
cue.addTempoAdjustment("B", 180, 144, 35, { startMeasure: 55 })

/* 
:::::::::::
:: CUE C ::
:::::::::::
*/

cue.append("C", Cue.genMeasure(116, [2,2]), {measureNum: "PREP"})
// ritardando
cue.append("C", Cue.genMeasure(116, [2,2,2,2]), {measureNum: 62, repeat: 7 })
cue.append("C", Cue.genMeasure(120, [2,2,2,2]), {measureNum: 69, repeat: 16 })
// accelerando
cue.append("C", Cue.genMeasure(120, [2,2,2,2]), {measureNum: 85, repeat: 2 })
cue.append("C", Cue.genMeasure(144, [2,2,2,2]), {measureNum: 87, repeat: 17 })
// ritardando
cue.append("C", Cue.genMeasure(144, [2,2,2,2]), {measureNum: 104, repeat: 5 })
cue.append("C", Cue.genMeasure(120, [2,2,2,2]), {measureNum: 108, repeat: 5 })
// ritardando
cue.append("C", Cue.genMeasure(120, [2,2,2,2]), {measureNum: 114, repeat: 3 })
cue.append("C", Cue.genMeasure(96, [2,2,2,2]), {measureNum: 117, repeat: 3 })

// CUE C TEMPO ADJUSTMENTS
cue.addTempoAdjustment("C", 116, 96, 28, { startMeasure: 65 })
cue.addTempoAdjustment("C", 120, 144, 16, { startMeasure: 85 })
cue.addTempoAdjustment("C", 144, 120, 40, { startMeasure: 104 })
cue.addTempoAdjustment("C", 120, 96, 24, { startMeasure: 114 })


/* 
:::::::::::::::::::::::
:: CUE CONFIGURATION ::
:::::::::::::::::::::::
*/
cue.append("configuration", Cue.genMeasure(352, [4,4,4,4]), {measureNum: 1, repeat: 100})


cue.save("./src/generatedCueSheet.json")
