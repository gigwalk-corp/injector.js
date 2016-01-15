/* eslint object-shorthand: 0, react/prefer-es6-class: 0, react/no-multi-comp: 0, no-console: 0 */
const ReactDOM = require('react-dom/server');
const React = require('react');
const injectorjs = require('../lib/index');
const injectToContext = require('../lib/injectIntoContext');

const MyComponent = React.createClass({
    contextTypes: {
        injectedValue: React.PropTypes.string.isRequired
    },
    render: function render() {
        return React.createElement('h1', null, this.context.injectedValue);
    }
});

const MyContainer = React.createClass({
    childContextTypes: {
        injectedValue: React.PropTypes.string.isRequired
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(MyComponent, null)
        );
    }
});

MyContainer.injectedValue = 'inject';

const injector = new injectorjs.Injector();
injector.map('injectedValue').toValue('Hello World!');
const InjectedMyContainer = injectToContext(MyContainer);

console.log(ReactDOM.renderToString(React.createElement(InjectedMyContainer, { injector: injector })));
