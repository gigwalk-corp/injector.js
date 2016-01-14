
export default function injectIntoContext(injector, Component) {
    Object.defineProperty(Component.prototype, 'getChildContext', {
        writable: false,
        configurable: false,
        enumerbale: false,
        value: function getChildContext() {
            const context = {};
            for (const key in Component) {
                if (Component[key] === 'inject') {
                    context[key] = injector.getInstance(key);
                }
            }

            return context;
        }
    });
}
