import { Injector } from '../src/';

describe('childInjector', () => {
    let injector;
    beforeEach(() => { injector = new Injector(); });
    it('defaults to null when it was not instantiated by a parent', () => {
        expect(injector.getParentInjector()).toBeNull();
    });

    it('can create a childInjector which references to its parent', () => {
        const childInjector = injector.createChildInjector();

        expect(childInjector).not.toBeNull();
        expect(childInjector.getParentInjector()).toBe(injector);
        expect(childInjector).not.toBe(injector);
    });

    it('has no parentInjector when it is the top parent', () => {
        expect(injector.getParentInjector()).toBeNull();

        injector.createChildInjector();
        expect(injector.getParentInjector()).toBeNull();
    });

    it('can set the parentInjector', () => {
        const parentInjector = new Injector();
        injector.setParentInjector(parentInjector);

        expect(injector.getParentInjector()).toBe(parentInjector);
    });

    it('throws an error when trying to set a parentInjector which is not an injector (or null)', () => {
        const parentInjector = {};

        expect(() => { injector.setParentInjector(parentInjector); })
            .toThrow(new Error('Cannot set the parentInjector because it is not an injector'));
        expect(injector.getParentInjector()).toBeNull();
    });

    it('can nullify the parentInjector', () => {
        const parentInjector = new Injector();
        injector.setParentInjector(parentInjector);

        expect(() => { injector.setParentInjector(null); }).not.toThrow();
        expect(injector.getParentInjector()).toBeNull();
    });

    it('validates mappings on a child that stem from its parent as if it were its own mappings', () => {
        const childInjector = injector.createChildInjector();

        expect(injector.hasMapping('someValue')).toBe(false);
        expect(childInjector.hasMapping('someValue')).toBe(false);

        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        expect(injector.hasMapping('someValue')).toBe(true);
        expect(childInjector.hasMapping('someValue')).toBe(true);
    });

    it('hides mappings from its parent', () => {
        const childInjector = injector.createChildInjector();
        const someValue = 'Hello World';
        childInjector.map('someValue').toValue(someValue);

        expect(childInjector.hasMapping('someValue')).toBe(true);
        expect(injector.hasMapping('someValue')).toBe(false);
    });

    it('returns the instance that was mapped on the parent', () => {
        const childInjector = injector.createChildInjector();

        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        expect(injector.getInstance('someValue')).toBe(someValue);
        expect(childInjector.getInstance('someValue')).toBe(someValue);
    });

    it('throws an error when the parent tries to get access to a mapping that was only mapped on the childInjector', () => {
        const childInjector = injector.createChildInjector();
        const someValue = 'Hello World';
        childInjector.map('someValue').toValue(someValue);

        expect(childInjector.getInstance('someValue')).toBe(someValue);
        expect(() => { injector.getInstance('someValue'); })
            .toThrow(new Error('Cannot return instance "someValue" because no mapping has been found'));
    });

    it('can create multiple child injectors', () => {
        const injectorChild1 = injector.createChildInjector();
        const injectorChild2 = injector.createChildInjector();
        const injector1Child = injectorChild1.createChildInjector();

        expect(injector.getParentInjector()).toBeNull();
        expect(injectorChild1.getParentInjector()).toBe(injector);
        expect(injectorChild2.getParentInjector()).toBe(injector);
        expect(injector1Child.getParentInjector()).toBe(injectorChild1);
    });

    it('can access mappings from a parent multiple levels up', () => {
        const injectorChild1 = injector.createChildInjector();
        const injector1Child = injectorChild1.createChildInjector();

        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);
        const otherValue = 'Hello child!';
        injectorChild1.map('otherValue').toValue(otherValue);

        expect(injector.getInstance('someValue')).toBe(someValue);
        expect(injectorChild1.getInstance('someValue')).toBe(someValue);
        expect(injector1Child.getInstance('someValue')).toBe(someValue);

        expect(injectorChild1.getInstance('otherValue')).toBe(otherValue);
        expect(injector1Child.getInstance('otherValue')).toBe(otherValue);
    });

    it('can create mappings for keys that already exist on the parent', () => {
        const injectorChild = injector.createChildInjector();

        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);
        const otherValue = 'Hello child!';

        expect(() => {
            injectorChild.map('someValue').toValue(otherValue);
        }).not.toThrow(new Error('Already has mapping for someValue'));
    });

    it('force maps itself as the injector', () => {
        const injectorChild = injector.createChildInjector();

        expect(injector).not.toBe(injectorChild);
        expect(injector.getInstance('injector')).toBe(injector);
        expect(injectorChild.getInstance('injector')).toBe(injectorChild);
    });

    it('can verify if the injector has a mapping', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        expect(injector.hasMapping('someValue')).toBeTruthy();
    });

    it('can verify if the injector has a mapping on the parent injector', () => {
        const injectorChild = injector.createChildInjector();
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        expect(injectorChild.hasMapping('someValue')).toBeTruthy();
    });

    it('can verify if the injector has a direct mapping', () => {
        const injectorChild = injector.createChildInjector();
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        expect(injector.hasDirectMapping('someValue')).toBeTruthy();
        expect(injectorChild.hasDirectMapping('someValue')).toBeFalsy();
    });
});
