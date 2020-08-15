const getVariance = (data, mean) => {
    let summedSqrs = 0
    data.forEach(d => summedSqrs += (d - mean) ** 2)
    return summedSqrs / (data.length - 1)
}

const setters = {

    appendLatencyPing(dataPoint) {
        let { runningLatencySum, numLatencyPings, latencyPings } = this.state;
        let latencyPingsCopy = [...latencyPings]

        const timeDiff = dataPoint.serverTime - dataPoint.clientTime;

        latencyPingsCopy.push(timeDiff)

        numLatencyPings += 1;
        runningLatencySum += timeDiff
        const latency = Math.round(runningLatencySum / numLatencyPings)

        const latencyVariance = getVariance(latencyPingsCopy, latency)


        this.setState({ runningLatencySum, numLatencyPings, latency, latencyPings: latencyPingsCopy, latencyVariance })
        // this.setters.setLatencyPings([...this.state.latencyPings, dataPoint])
    },

    calcAndSetLatency() {
        const data = this.state.latencyPings.map(dataPoint => dataPoint.serverTime - dataPoint.clientTime);
        const averageLatency = data.reduce((a, b) => a + b) / data.length;
        const rounded = Math.round(averageLatency)
        this.setState({ latency: rounded })
    },

    incrementCount() {
        this.setState({
            count: this.state.count === 4 ? 1 : this.state.count + 1
        })
    },

    setPlayerLatencyInfo({ player, roundtrip, playerLatencyPings }) {
        const playerDelays = { ...this.state.playerDelays };
        playerDelays[player] = roundtrip;

        this.setState({ playerDelays, playerLatencyPings })
    },

    resetLatency() {
        this.setState({
            latencyPings: [],
            runningLatencySum: 0,
            numLatencyPings: 0,
            latencyVariance: null,
            latency: null,
        })
    }



}

export default setters;
