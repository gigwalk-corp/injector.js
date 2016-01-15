import 'babel-polyfill';
import { PropTypes } from 'react';
import { Injector } from './index.js';
class InjectorContextError extends Error {

}
/**
 * Creates an extended component that will use injector-js DI to inject into the context.
 * @param  {React.Component} Component The Component To Extend
 * @return {React.Component}           Extended Component
 */
export default function createInjectorContainer(Component) {
    if (!Component.hasOwnProperty('childContextTypes')) {
        throw new InjectorContextError('Expected childContextTypes to be defined on the container element', Component);
    }

    const injectables = Object.entries(Component)
        .filter(([, value]) => value === 'inject');
    if (!injectables.length) {
        throw new InjectorContextError('Exepected static strings to be defined on the container class', Component);
    }

    const temp = class extends Component {
        constructor() {
            super(...arguments);
        }

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
                    injectables.reduce((context, [key]) => {
                        return {
                            ...context,
                            [key]: this.props.injector.getInstance(key)
                        };
                    }, {})
                )
            };
        }
    };

    temp.displayName = `Injected${Component.name}`;

    return temp;
};
