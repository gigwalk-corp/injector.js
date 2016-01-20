import React, { Component, PropTypes } from 'react';
export default class ComponentNoGetChildContext extends Component {
    static childContextTypes = {
        injectedValue: PropTypes.string.isRequired
    };

    static injectedValue = 'inject';

    render() {
        return <div/>;
    }
}
