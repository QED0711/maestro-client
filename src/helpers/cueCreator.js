

class Cue {
    constructor(){
        this.cueSheet = {};
    }

    append(cue, measure, options){
        let {repeat, startMeasure, measures} = options;
        repeat = repeat || 1;
        startMeasure = startMeasure || 1;


        this.cueSheet[cue] = this.cueSheet[cue] || []; // initialize the cue if not already added

        if(!!measures){ // if the user indicated a measure list

            for(let measureNum of measures){
                this.cueSheet[cue].push({...measure, measureNum})
            }

        } else { // if the user just indicated a starting measure
            for(let i = startMeasure; i < startMeasure + repeat; i++){
                this.cueSheet[cue].push({
                    ...measure,
                    measureNum: i
                })
            }
        }

    }

    save(path){
        const cueSheet = JSON.stringify(this.cueSheet);

        console.log(cueSheet)
    }
}


// =============================== TEST ===============================

const cue = new Cue();

cue.append("cue1", {
    bpm: 60, 
    subdivision: 4,
    numBeats: 4,
    parts:["*"],
}, {measures: [1,2,"3a", "3b"], repeat: 4})

cue.save()