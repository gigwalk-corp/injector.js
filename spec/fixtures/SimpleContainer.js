import React, { Component, PropTypes } from 'react';
import SimpleComponent from './SimpleComponent';

export default class SimpleContainer extends Component {
    static propTypes = {
        color: PropTypes.string.isRequired
    };
    static childContextTypes = {
        injectedValue: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    };
    getChildContext() {
        return {
            name: 'SimpleContainer'
        };
    }

    static injectedValue = 'inject';

    render() {
        const { color } = this.props;
        return (
            <div style={color}>
                <SimpleComponent />
            </div>
        );
    }
}
