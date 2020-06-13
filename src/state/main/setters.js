
const setters = {

    appendLatencyPing(dataPoint){
        this.setters.setLatencyPings([...this.state.latencyPings, dataPoint])
    },

    calcAndSetLatency(){
        const data = this.state.latencyPings.map(dataPoint => dataPoint.serverTime - dataPoint.clientTime);
        const averageLatency = data.reduce((a, b) => a + b) / data.length;
        const rounded = Math.round(averageLatency)
        this.setState({latency: rounded})        
    }

}

export default setters;
