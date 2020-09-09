import state from "./state";

const methods = {


    adjustActiveCues(player){

        let currentActiveCues = [...this.state.activeCues];
        if(currentActiveCues.includes(player)){
            currentActiveCues = currentActiveCues.filter(p => p !== player)
        } else {
            currentActiveCues.push(player)
        }

        this.setters.setActiveCues(currentActiveCues)
    },

    getRole(){
        return this.state.role
    },

    getLatency(){
        return this.state.latency
    },

    getLatencyPings(){
        return this.state.latencyPings
    },

    getLatencyVariance(){
        return this.state.latencyVariance
    },

    getCount(){
        return this.state.count
    },

    getPlayActive(){
        return this.state.playActive
    },

    getIsMuted(){
        return this.state.isMuted
    },

    getPlayer(){
        return this.state.player
    },
    
    getActiveCues(){
        return this.state.activeCues
    },

    getCueDelay(){
        return this.state.cueDelay
    },

    async getTrueLatency(){
        return new Promise(resolve => {
            while (true){ // block until true latency has a value
                if(this.state.trueLatency) break;
            }
            const trueLatency = this.state.trueLatency
            this.setters.setTrueLatency(null) // reset trueLatency value
            resolve(trueLatency)
        })
    }


}

export default methods;
