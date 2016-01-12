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
        const postConstructs = object.postConstructs !== undefined ?
            object.postConstructs instanceof Array ? object.postConstructs : [] : [];
        let index;
        let methodName;
        let method;

        for (index in postConstructs) {
            methodName = postConstructs[index];
            method = object[methodName] === undefined ? null : object[methodName];

            if (typeof method === 'function') {
                method.apply(object);
            }
        }
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
        if (this.hasMapping(type, name)) {
            return this.getMapping(type, name).getValue();
        } else {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(
                `Cannot return instance "${type}${nameError}" because no mapping has been found`
            );
        }
    }

    getMapping(type, name) {
        if (this.hasMapping(type, name)) {
            const mappingID = this._getMappingID(type, name);
            if (this._mappings[mappingID] !== undefined) {
                return this._mappings[mappingID];
            } else {
                return this.getParentInjector().getMapping(type, name);
            }
        } else {
            const nameError = name === undefined ? '' : ` by name ${name}`;
            throw new Error(`Mapping "${type}${nameError}" was not found`);
        }
    }

    injectInto(object) {
        let injectionObject;

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
