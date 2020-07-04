
const fs = require("fs");
const { start } = require("repl");

class Cue {
    constructor() {
        this.cueSheet = {};
    }

    append(cue, measure, options) {
        let { repeat, startMeasure, measures } = options;
        repeat = repeat || 1;
        startMeasure = startMeasure || 1;


        this.cueSheet[cue] = this.cueSheet[cue] || []; // initialize the cue if not already added

        if (!!measures) { // if the user indicated a measure list

            for (let measureNum of measures) {
                this.cueSheet[cue].push({ ...measure, measureNum })
            }

        } else { // if the user just indicated a starting measure
            for (let i = startMeasure; i < startMeasure + repeat; i++) {
                this.cueSheet[cue].push({
                    parts: ["*"],
                    measureNum: i,
                    ...measure,
                })
            }
        }

    }


    addTempoAdjustment(cue, fromTempo, toTempo, options = {}) {

        /* 
        This method mutates the instance's cueSheet to add tempo adjustments
        */

        // 1. get the cue list 
        cue = this.cueSheet[cue]
        let { startMeasure, numBeats } = options;

        // 3a. initialization
        startMeasure = startMeasure ? startMeasure - 1 : 0;
        numBeats = numBeats || 1;

        // 3b. Calculate the total change and the per-beat change
        const totalChange = toTempo - fromTempo;
        const adjustment = totalChange / numBeats;
                
        let beatsLeft = numBeats;

        // 4. apply tempo adjustments to appropriate measures
        for (let [i, measure] of Object.entries(cue)){
            
            // haven't reached the target start measure yet, continue
            if(i < startMeasure) continue;

            // if there are still beats to adjust...
            if(beatsLeft >= measure.numBeats){
                measure.tempoAdjustment = adjustment
                beatsLeft -= measure.numBeats
            } else {
                measure.tempoAdjustment = adjustment
                measure.stopAdjustment = beatsLeft;
                beatsLeft = 0;
            }

            // if we have adjusted all beats
            if(beatsLeft === 0) break;
        }
    }

    addFermata(cue, options={}) {
        cue = this.cueSheet[cue]

        const {measure, beat, duration} = options;

        cue[measure - 1].fermata = beat
        cue[measure - 1].fermataDuration = duration
    }


    save(path = "./cueSheet.json") {
        fs.writeFileSync(path, JSON.stringify(this.cueSheet))
    }
}


// =============================== TEST ===============================

const cue = new Cue();

cue.append("cueA", { bpm: 60, subdivision: 4, numBeats: 4 }, { repeat: 2 })
// cue.append("cueA", { bpm: 60, subdivision: 4, numBeats: 2 }, { repeat: 2 })
// cue.append("cueA", { bpm: 60, subdivision: 4, numBeats: 4 }, { repeat: 5 })

// cue.addTempoAdjustment("cueA", 60, 104, { numBeats: 15, startMeasure: 4 })

cue.addFermata("cueA", {measure: 1, beat: 3, duration: 4000})

cue.save("./src/generatedCueSheet.json")