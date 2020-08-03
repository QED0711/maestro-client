
const setters = {

    appendLatencyPing(dataPoint){
        this.setters.setLatencyPings([...this.state.latencyPings, dataPoint])
    },

    calcAndSetLatency(){
        const data = this.state.latencyPings.map(dataPoint => dataPoint.serverTime - dataPoint.clientTime);
        const averageLatency = data.reduce((a, b) => a + b) / data.length;
        const rounded = Math.round(averageLatency)
        this.setState({latency: rounded})        
    },

    incrementCount(){
        this.setState({
            count: this.state.count === 4 ? 1 : this.state.count + 1
        })
    },

    setPlayerDelay(player, roundtrip){
        const playerDelays = {...this.state.playerDelays};
        playerDelays[player] = roundtrip;

        this.setState({playerDelays})
    }

}

export default setters;
