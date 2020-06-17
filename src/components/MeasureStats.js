import React, { useContext } from 'react';
import { mainContext } from '../state/main/mainProvider';

class MeasureStats extends React.Component {
    // const {state, methods} = useContext(mainContext);

    constructor(props){
        super(props)
        console.log(this.props)
    }

    render(){
        
        return (
            <div>
                COUNT: {this.props.count}
            </div>
        )
    }
}

export default MeasureStats;