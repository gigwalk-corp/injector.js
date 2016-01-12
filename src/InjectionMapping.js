export default class InjectionMapping {
    constructor(type, name, id) {
        this._type = type;
        this._name = name;
        this._id = id;

        this._value = null;
        this._toType = null;
    }

    _isValid() {
        return this._value !== null || this._toType !== null;
    }

    _validateBeforeCreation() {
        if (this._isValid()) {
            throw new Error(
                `Could not create mapping for ${this._id} because it already has been defined`
            );
        }

        return true;
    }

    toValue(value) {
        if (!this._validateBeforeCreation()) {
            return;
        }

        this._value = value;
    }

    toType(type) {
        if (!this._validateBeforeCreation()) {
            return;
        }

        this._toType = type;
    }

    toSingleton(Type) {
        this.toValue(new Type());
    }

    getValue() {
        if (!this._isValid()) {
            throw new Error(`Could not get value for ${this._id} because the mapping is invalid`);
        }

        if (this._value !== null) {
            return this._value;
        } else if (this._toType !== null) {
            return new this._toType();
        }
    }
}
