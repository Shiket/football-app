import React from 'react';
import axios from 'axios';
import { Loader } from '../../styleComponents/index'
import * as DATA from '../../constants/data';

export default (WrappedComponent) => {
    return class TeamPageHOC extends React.Component {
        state = {
            nextMatches: [],
            lastMatches: [],
        };

        async componentDidMount() {
            let next5 = await axios.get(DATA.NEXT_MATCHES + this.props.location.state.state[0].teamid);
            let last5 = await axios.get(DATA.LAST_MATCHES + this.props.location.state.state[0].teamid);
            console.log(last5)
            this.setState({
                nextMatches: [...next5.data.events],
                lastMatches: [...last5.data.results],
            });
        }

        render() {
            if (this.state.nextMatches.length === 0) return <Loader header><div></div></Loader>;
            return (
                <WrappedComponent {...this.props}
                    nextMatches={this.state.nextMatches}
                    lastMatches={this.state.lastMatches}
                     />
            )
        }
    }
};
