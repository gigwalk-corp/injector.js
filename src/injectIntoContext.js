import 'babel-polyfill';
export class InjectorContextError extends Error {}

export default function injectIntoContext(injector, Component) {
    if (!Component.hasOwnProperty('childContextTypes')) {
        throw new InjectorContextError('Expected childContextTypes to be defined on the container element');
    }

    Object.defineProperty(Component.prototype, 'getChildContext', {
        writable: false,
        configurable: false,
        enumerbale: false,
        value: function getChildContext() {
            const context = {};
            const injectables = Object.entries(Component)
                .filter(([, value]) => value === 'inject');
            if (!injectables.length) {
                throw new InjectorContextError('Exepected static strings to be defined on the container class');
            }

            injectables
                .forEach(([key]) => {
                    context[key] = injector.getInstance(key);
                });

            return context;
        }
    });

    return Component;
}
