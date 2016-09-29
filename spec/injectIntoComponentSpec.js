import React from 'react';
import TestUtils, { createRenderer, renderIntoDocument } from 'react-addons-test-utils';
import { Injector } from '../src/';
import injectoIntoComponent from '../src/injectIntoComponent';
import SimpleContainer from './fixtures/SimpleContainer';
import SimpleComponent from './fixtures/SimpleComponent';
import AppContainer from './fixtures/AppContainer';
import UserAvatar from './fixtures/UserAvatar';

describe('React Integration Inject into Component', () => {
    let injector;
    let renderer;
    beforeEach(() => {
        injector = new Injector();
        renderer = createRenderer();
    });

    it('should inject simple values into the component class', () => {
        injector.map('injectedValue').toValue('expected');
        const InjectedSimpleContainer = injectoIntoComponent(SimpleContainer);
        renderer.render(<InjectedSimpleContainer injector={injector} />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual(<SimpleComponent />);
        const doc = renderIntoDocument(<InjectedSimpleContainer injector={injector} />);
        const h1 = TestUtils.findRenderedDOMComponentWithTag(doc, 'h1');
        expect(h1.textContent).toEqual('expected');
    });

    it('should throw an error if context types are not defined on the Component', () => {
        expect(() => injectoIntoComponent(SimpleComponent)).toThrowError(Error, 'Expected childContextTypes to be defined on the container element');
    });

    it('should throw an error if the component doesn\'t declare injectable properties', () => {
        expect(() => injectoIntoComponent(AppContainer)).toThrowError(Error, 'Exepected static strings to be defined on the container class');
    });

    it('should allow basic context integration', () => {
        injector.map('userStore').toValue({
            getUser() {
                return { avatarUrl: 'https://placekitten.com/200/300' };
            }
        });

        renderer.render(<AppContainer injector={injector} />);
        const results = renderer.getRenderOutput();
        expect(results.type).toEqual('div');
        expect(results.props.children).toEqual(
            <UserAvatar />
        );
    });
});
