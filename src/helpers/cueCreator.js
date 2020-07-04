
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

        cue = this.cueSheet[cue]
        let { startMeasure, numBeats } = options;

        startMeasure = startMeasure ? startMeasure - 1 : 0;
        numBeats = numBeats || 1;


        const totalChange = toTempo - fromTempo;

        const adjustment = totalChange / numBeats;

        let currentMeasure = startMeasure;
        let beatsLeft = numBeats;

        for (let [i, measure] of Object.entries(cue)){
            
            if(i < startMeasure) continue;

            if(beatsLeft >= measure.numBeats){
                measure.tempoAdjustment = adjustment
                beatsLeft -= measure.numBeats
            } else {
                measure.tempoAdjustment = adjustment
                measure.stopAdjustment = beatsLeft;
                beatsLeft = 0;
            }

            if(beatsLeft === 0) break;
        }



    }

    addFermata(cue) {

    }


    save(path = "./cueSheet.json") {
        fs.writeFileSync(path, JSON.stringify(this.cueSheet))
    }
}


// =============================== TEST ===============================

const cue = new Cue();

cue.append("cue1", { bpm: 60, subdivision: 4, numBeats: 4 }, { repeat: 10 })
cue.addTempoAdjustment("cue1", 60, 120, { numBeats: 15, startMeasure: 2 })

cue.save()