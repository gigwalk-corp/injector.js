import React, { Component } from 'react';

export default class SimpleComponent extends Component {
    static propTypes = {
        injectedValue: React.PropTypes.string
    };
    static injectedValue = 'inject';
    render() {
        return <h1>{this.injectedValue}</h1>;
    }
}
