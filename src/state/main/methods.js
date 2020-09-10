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
        const requestTrueLatency = resolve => () => {
            if(this.state.trueLatency){
                const tl = this.state.trueLatency
                console.log(tl)
                this.setters.setTrueLatency(null) 
                resolve(tl)
                return
            } else {
                setTimeout(requestTrueLatency(resolve), 10)
            }
        }
        return new Promise(resolve => { 
           requestTrueLatency(resolve)() 
        })
    }


}

export default methods;
