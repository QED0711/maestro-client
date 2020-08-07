
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
    }


}

export default methods;
