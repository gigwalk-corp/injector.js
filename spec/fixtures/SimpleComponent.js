import React, { Component, PropTypes } from 'react';

export default class SimpleComponent extends Component { // eslint-disable-line react/prefer-stateless-function
    static contextTypes = {
        injectedValue: PropTypes.string.isRequired
    };
    render() {
        return <h1>{this.context.injectedValue}</h1>;
    }
}
