// @flow weak
import { PropTypes } from 'react';
import Injector from './Injector';
/**
 * Creates an extended component that will use injector-js DI to inject into the context.
 * @param  {React.Component} Component The Component To Extend
 * @return {React.Component}           Extended Component
 */
export default function injectIntoComponent(Component) {
    if (!Component.hasOwnProperty('childContextTypes')) {
        throw new Error('Expected childContextTypes to be defined on the container element', Component);
    }

    const injectables = Object.keys(Component).map(key => [key, Component[key]])
        .filter(([, value]) => value === 'inject');
    if (!injectables.length) {
        throw new Error('Exepected static strings to be defined on the container class', Component);
    }

    const temp = class extends Component {

        static get propTypes() {
            return {
                ...super.propTypes,
                injector: PropTypes.instanceOf(Injector).isRequired
            };
        }

        getChildContext() {
            return {
                ...(super.getChildContext ? super.getChildContext() : {}),
                ...(
                    injectables.reduce((context, [key]) => ({
                        ...context,
                        [key]: this.props.injector.getInstance(key)
                    }), {})
                )
            };
        }
    };

    temp.displayName = `Injected${Component.name}`;

    return temp;
}
