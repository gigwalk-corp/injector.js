import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { Injector } from '../src/';
import SimpleComponent from './fixtures/SimpleComponent';

describe('React Integration', () => {
    let injector;

    beforeEach(() => (injector = new Injector()));

    it('should inject simple values into the component class', () => {
        injector.map('injectedValue').toValue('expected');
        injector.injectInto(SimpleComponent);
        const renderer = createRenderer();
        renderer.render(<SimpleComponent/>);
        const result = renderer.getRenderOutput();
        expect(result.props.children).toEqual('expected');
    });
});
