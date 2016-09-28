// @flow
import InjectionMapping from './InjectionMapping';
import stringToObject from './stringToObject';

export default class Injector {
    _mappings: { [mapping: string]: InjectionMapping };
    _parentInjector: ?Injector;
    constructor(parentInjector?: Injector) {
        this._mappings = {};
        this._parentInjector = null;
        this.map('injector').toValue(this);
        this._parentInjector = parentInjector || null;
    }

    _createMapping(type: string, name?: string, id: string): InjectionMapping {
        if (this._hasOwnMapping(type, name)) {
            throw new Error(`Already has mapping for ${type}`);
        }

        const mapping = new InjectionMapping(type, name, id);
        this._mappings[id] = mapping;

        return mapping;
    }

    _getMappingID(type: string, name: string = '') { // eslint-disable-line class-methods-use-this
        return `${type}|${name}`;
    }

    _hasOwnMapping(type: string, name?: string): boolean {
        const mappingID = this._getMappingID(type, name);
        return (this._mappings[mappingID] !== undefined);
    }

    _postConstruct(object: { postConstructs: ?Array<any> }) {  // eslint-disable-line class-methods-use-this
        /* eslint-disable no-nested-ternary */
        const postConstructs = object.postConstructs !== undefined ?
           object.postConstructs instanceof Array ? object.postConstructs : [] : [];
        /* eslint-enable no-nested-ternary */
        let index;
        let methodName;
        let method;
        /* eslint-disable guard-for-in */
        // $FlowFixMe should refactor this code once we know what it should be
        for (index in postConstructs) { // eslint-disable-line no-restricted-syntax
            // $FlowFixMe should refactor this code once we know what it should be
            methodName = postConstructs[index];
            method = object[methodName] === undefined ? null : object[methodName];

            if (typeof method === 'function') {
                method.apply(object);
            }
        }
        /* eslint-enable guard-for-in */
    }

    map(type: string, name?: string) {
        const mappingID = this._getMappingID(type, name);
        return this._mappings[mappingID] || this._createMapping(type, name, mappingID);
    }

    unmap(type: string, name?: string) {
        if (this.hasMapping(type, name)) {
            const mappingID = this._getMappingID(type, name);
            delete this._mappings[mappingID];
        } else {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(`Cannot unmap "${type}${nameError}" because no mapping has been found`);
        }
    }

    hasMapping(type: string, name?: string): boolean {
        return this._hasOwnMapping(type, name) ||
            (this._parentInjector != null && this._parentInjector.hasMapping(type, name));
    }

    hasDirectMapping(type: string, name?: string): boolean {
        return this._hasOwnMapping(type, name);
    }

    getInstance(type: string, name?: string): any {
        if (!this.hasMapping(type, name)) {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(
                `Cannot return instance "${type}${nameError}" because no mapping has been found`
            );
        }

        return this.getMapping(type, name).getValue();
    }

    getMapping(type: string, name?: string): InjectionMapping {
        if (!this.hasMapping(type, name)) {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(`Mapping "${type}${nameError}" was not found`);
        }

        const mappingID = this._getMappingID(type, name);
        return this._mappings[mappingID] !== undefined ?
            this._mappings[mappingID] :
            (() => {
                const parent = this.getParentInjector();
                if (!(parent instanceof Injector)) {
                    throw new Error('Could not get parent injector');
                }
                return parent.getMapping(type, name);
            })();
    }

    injectInto(object: any) {
        /* eslint-disable guard-for-in, no-param-reassign */
        for (const member in object) {  // eslint-disable-line no-restricted-syntax
            const injectionObject = stringToObject(member, object[member]);

            if (injectionObject != null) {
                if (this.hasMapping(injectionObject.type, injectionObject.name)) {
                    object[member] = this.getInstance(injectionObject.type, injectionObject.name);
                } else {
                    throw new Error(
                        `Cannot inject ${injectionObject.type} into ${object} due to a missing rule`
                    );
                }
            }
        }
        /* eslint-enable guard-for-in, no-param-reassign */

        this._postConstruct(object);
    }

    teardown() {
        this._mappings = {};
        this.map('injector').toValue(this);
    }

    getParentInjector(): ?Injector {
        return this._parentInjector;
    }

    setParentInjector(parentInjector: Injector) {
        if (parentInjector != null && !(parentInjector instanceof Injector)) {
            throw new Error('Cannot set the parentInjector because it is not an injector');
        }

        this._parentInjector = parentInjector;
    }

    createChildInjector(): Injector {
        return new Injector(this);
    }
}
