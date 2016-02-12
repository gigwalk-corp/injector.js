import { Injector } from '../src/index';

describe('Injector', () => {
    let injector;
    beforeEach(() => (injector = new Injector()));

    it('Has a defined injector', () => expect(injector).not.toBeNull());

    it('Injects a basic type by variable name', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        const someObject = {
            someValue: 'inject'
        };
        injector.injectInto(someObject);

        expect(someObject.someValue).toBe(someValue);
    });

    it('Injects a newly created type by variable name', () => {
        function SomeClass() {
            this.hello = 'Hello World';
        }

        injector.map('someValue').toType(SomeClass);

        const someObject = {
            someValue: 'inject'
        };
        injector.injectInto(someObject);

        expect(someObject.someValue.hello).toBe('Hello World');
    });

    it('Injects a specific type that doesn\'t have anything to do with the variable name', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        const someObject = {
            otherValue: 'inject:someValue'
        };
        injector.injectInto(someObject);

        expect(someObject.otherValue).toBe(someValue);
    });

    it('injects an object by name', () => {
        const someValue1 = 'Hello World 1';
        const someValue2 = 'Hello World 2';

        injector.map('someValue', 'one').toValue(someValue1);
        injector.map('someValue', 'two').toValue(someValue2);

        const someObject1 = {
            someValue: 'inject(name="one")'
        };
        injector.injectInto(someObject1);

        const someObject2 = {
            someValue: 'inject(name="two")'
        };
        injector.injectInto(someObject2);

        expect(someObject1.someValue).toBe(someValue1);
        expect(someObject2.someValue).toBe(someValue2);
    });

    it(`Injects a named specific type that doesn't have anything to do with the variable name`, () => {
        const someValue1 = 'Hello World 1';
        const someValue2 = 'Hello World 2';

        injector.map('someValue', 'one').toValue(someValue1);
        injector.map('someValue', 'two').toValue(someValue2);

        const someObject = {
            otherValue1: 'inject(name="one"):someValue',
            otherValue2: 'inject(name="two"):someValue'
        };
        injector.injectInto(someObject);

        expect(someObject.otherValue1).toBe(someValue1);
        expect(someObject.otherValue2).toBe(someValue2);
    });

    it('Calls post constructs', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        const someObject = {
            postConstructs: ['onPostConstruct'],
            counter: 0,
            someValue: 'inject',

            onPostConstruct() {
                this.counter++;
            }
        };
        injector.injectInto(someObject);

        expect(someObject.counter).toBe(1);
    });

    it('Calls post constructs and injects on a newly created instance', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);

        class MyClass {
            someValue = 'inject';
            postConstructs = ['onPostConstruct'];
            constructor() {
                this.counter = 0;
            }

            onPostConstruct() {
                this.counter++;
            }
        }

        const someObject = new MyClass();
        injector.injectInto(someObject);
        expect(someObject.counter).toBe(1);
        expect(someObject.someValue).toBe(someValue);
    });

    it('returns an instance', () => {
        const someObject = () => {};

        someObject.prototype = { testVar: 'test' };

        injector.map('someObject').toType(someObject);

        const someCreatedObject1 = injector.getInstance('someObject');

        expect(someCreatedObject1.testVar).toEqual('test');
    });

    it('returns two unique instances', () => {
        const someObject = () => {};

        someObject.prototype = { testVar: 'test' };

        injector.map('someObject').toType(someObject);

        const someCreatedObject1 = injector.getInstance('someObject');
        const someCreatedObject2 = injector.getInstance('someObject');
        someCreatedObject2.testVar = 'hello world';

        expect(someCreatedObject1.testVar).not.toEqual(someCreatedObject2.testVar);
    });

    it('returns the same singleton instance', () => {
        const someObject = () => {};

        someObject.prototype = { testVar: 'test' };

        injector.map('someObject').toSingleton(someObject);

        const someCreatedObject1 = injector.getInstance('someObject');
        const someCreatedObject2 = injector.getInstance('someObject');
        someCreatedObject2.testVar = 'hello world';

        expect(someCreatedObject1.testVar).toEqual(someCreatedObject2.testVar);
    });

    it('returns a specific error when there is no mapping', () => {
        expect(() => {injector.getInstance('someObject');})
            .toThrow(new Error('Cannot return instance "someObject" because no mapping has been found'));
        expect(() => {injector.getInstance('someObject', 'someName');})
            .toThrow(new Error('Cannot return instance "someObject by name someName" because no mapping has been found'));
    });

    it('can unmap mappings by type', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);
        expect(injector.getInstance('someValue')).toBe(someValue);

        injector.unmap('someValue');

        expect(() => {injector.getInstance('someValue');}).toThrow(new Error('Cannot return instance "someValue" because no mapping has been found'));
    });

    it('can unmap mappings by type and name', () => {
        const someValue = 'Hello World';
        injector.map('someValue', 'myName').toValue(someValue);
        expect(injector.getInstance('someValue', 'myName')).toBe(someValue);

        injector.unmap('someValue', 'myName');

        expect(() => {injector.getInstance('someValue', 'myName');})
            .toThrow(new Error('Cannot return instance "someValue by name myName" because no mapping has been found'));
    });

    it('registers itself by the injector', () => {
        expect(injector.getInstance('injector')).toBe(injector);
    });

    it('can teardown itself (aka. unmapAll)', () => {
        const someValue = 'Hello World';
        injector.map('someValue').toValue(someValue);
        expect(injector.getInstance('someValue')).toBe(someValue);
        injector.map('someValue2').toValue(someValue);
        expect(injector.getInstance('someValue2')).toBe(someValue);

        injector.teardown();

        expect(() => {injector.getInstance('someValue');})
            .toThrow(new Error('Cannot return instance "someValue" because no mapping has been found'));
        expect(() => {injector.getInstance('someValue2');})
            .toThrow(new Error('Cannot return instance "someValue2" because no mapping has been found'));
    });
});
