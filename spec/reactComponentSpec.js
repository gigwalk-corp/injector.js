import React from 'react';
import TestUtils, { createRenderer, renderIntoDocument } from 'react-addons-test-utils';
import { Injector } from '../src/';
import injectIntoContext from '../src/injectIntoContext';
import SimpleContainer from './fixtures/SimpleContainer';
import SimpleComponent from './fixtures/SimpleComponent';
import AppContainer from './fixtures/AppContainer';
import UserAvatar from './fixtures/UserAvatar';

describe('React Integration', () => {
    let injector;
    let renderer;
    beforeEach(() => {
        injector = new Injector();
        renderer = createRenderer();
    });

    it('should inject simple values into the component class', () => {
        injector.map('injectedValue').toValue('expected');
        injectIntoContext(injector, SimpleContainer);
        renderer.render(<SimpleContainer />);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual(<SimpleComponent/>);
        const doc = renderIntoDocument(<SimpleContainer/>);
        const h1 = TestUtils.findRenderedDOMComponentWithTag(doc, 'h1');
        expect(h1.textContent).toEqual('expected');
    });

    it('should allow basic context integration', () => {
        injector.map('userStore').toValue({
            getUser() {
                return { avatarUrl: 'https://placekitten.com/200/300' };
            }
        });

        renderer.render(<AppContainer injector={injector}/>);
        const results = renderer.getRenderOutput();
        expect(results.type).toEqual('div');
        expect(results.props.children).toEqual(
            <UserAvatar/>
        );
    });
});
