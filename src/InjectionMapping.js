// @flow
export default class InjectionMapping {
    _type: mixed;
    _name: ?string;
    _id: string;
    _value: any;
    _toType: mixed;
    constructor(type: mixed, name?: string, id: string) {
        this._type = type;
        this._name = name;
        this._id = id;

        this._value = null;
        this._toType = null;
    }

    _isValid(): boolean {
        return this._value != null || this._toType != null; // eslint-disable-line eqeqeq
    }

    _validateBeforeCreation(): true {
        if (this._isValid()) {
            throw new Error(
                `Could not create mapping for ${this._id} because it already has been defined`
            );
        }

        return true;
    }

    toValue(value: any) {
        if (!this._validateBeforeCreation()) {
            return;
        }

        this._value = value;
    }

    toType(type: any) {
        if (!this._validateBeforeCreation()) {
            return;
        }

        this._toType = type;
    }

    toSingleton(Type: Function) {
        this.toValue(new Type());
    }

    getValue(): any {
        if (!this._isValid()) {
            throw new Error(`Could not get value for ${this._id} because the mapping is invalid`);
        }

        if (this._value != null) {
            return this._value;
        } else if (this._toType != null) {
            // $FlowFixMe should define that it is a instantiable thing
            return new this._toType();
        }
    }
}
