import React, { Component, PropTypes } from 'react';
import SimpleComponent from './SimpleComponent';
export default class SimpleContainer extends Component {
    static childContextTypes = {
        injectedValue: PropTypes.string.isRequired
    };
    static injectedValue = 'inject';
    render() {
        return (
            <div>
                <SimpleComponent />
            </div>
        );
    }
}
