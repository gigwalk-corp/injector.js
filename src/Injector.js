import InjectionMapping from './InjectionMapping';
import stringToObject from './stringToObject';

export default class Injector {
    constructor(parentInjector) {
        this._mappings = {};
        this._parentInjector = null;
        this.map('injector').toValue(this);
        this._parentInjector = parentInjector || null;
    }

    _createMapping(type, name, id) {
        if (this._hasOwnMapping(type, name)) {
            throw new Error(`Already has mapping for ${type}`);
        }

        const mapping = new InjectionMapping(type, name, id);
        this._mappings[id] = mapping;

        return mapping;
    }

    _getMappingID(type, name = '') {
        return `${type}|${name}`;
    }

    _hasOwnMapping(type, name) {
        const mappingID = this._getMappingID(type, name);
        return (this._mappings[mappingID] !== undefined);
    }

    _postConstruct(object) {
        /* eslint-disable no-nested-ternary */
        const postConstructs = object.postConstructs !== undefined ?
            object.postConstructs instanceof Array ? object.postConstructs : [] : [];
        /* eslint-enable no-nested-ternary */
        let index;
        let methodName;
        let method;
        /* eslint-disable guard-for-in */
        for (index in postConstructs) {
            methodName = postConstructs[index];
            method = object[methodName] === undefined ? null : object[methodName];

            if (typeof method === 'function') {
                method.apply(object);
            }
        }
        /* eslint-enable guard-for-in */
    }

    map(type, name) {
        const mappingID = this._getMappingID(type, name);
        return this._mappings[mappingID] || this._createMapping(type, name, mappingID);
    }

    unmap(type, name) {
        if (this.hasMapping(type, name)) {
            const mappingID = this._getMappingID(type, name);
            delete this._mappings[mappingID];
        } else {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(`Cannot unmap "${type}${nameError}" because no mapping has been found`);
        }
    }

    hasMapping(type, name) {
        return this._hasOwnMapping(type, name) ||
            (this._parentInjector !== null && this._parentInjector.hasMapping(type, name));
    }

    hasDirectMapping(type, name) {
        return this._hasOwnMapping(type, name);
    }

    getInstance(type, name) {
        if (!this.hasMapping(type, name)) {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(
                `Cannot return instance "${type}${nameError}" because no mapping has been found`
            );
        }

        return this.getMapping(type, name).getValue();
    }

    getMapping(type, name) {
        if (!this.hasMapping(type, name)) {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(`Mapping "${type}${nameError}" was not found`);
        }

        const mappingID = this._getMappingID(type, name);
        return this._mappings[mappingID] !== undefined ?
            this._mappings[mappingID] :
            this.getParentInjector().getMapping(type, name);
    }

    injectInto(object) {
        let injectionObject;
        /* eslint-disable guard-for-in, no-param-reassign */
        for (const member in object) {
            injectionObject = stringToObject(member, object[member]);

            if (injectionObject !== null) {
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

    getParentInjector() {
        return this._parentInjector;
    }

    setParentInjector(parentInjector) {
        if (parentInjector !== null && !(parentInjector instanceof Injector)) {
            throw new Error('Cannot set the parentInjector because it is not an injector');
        }

        this._parentInjector = parentInjector;
    }

    createChildInjector() {
        return new Injector(this);
    }
}
