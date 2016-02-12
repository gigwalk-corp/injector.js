import React, { Component, PropTypes } from 'react';

export default class SimpleComponent extends Component {
    static contextTypes = {
        injectedValue: PropTypes.string.isRequired
    };
    render() {
        return <h1>{this.context.injectedValue}</h1>;
    }
}
