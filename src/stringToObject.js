// @flow
export type InjectorObject = { name: string, type: string };
/**
 * Parse the value of a object to find out how we should inject
 * @param type The default type in the mapping. Could be overridden by injectionString
 * @param injectionString the value of the variable you want to inject into.
 *        Should be a string, else we return null
 *        String could be formatted like the following examples
 *
 *    - inject                        - Will in the end inject by type argument
 *    - inject:someValue              - Will override the type argument by the type after the colon
 *    - inject(name="one"):someValue  - Will use named injection with a custom type
 *    - inject(name="one")            - Will inject by name
 */
export default function stringToObject(type: string, injectionString: string): ?InjectorObject {
    if (typeof injectionString !== 'string') {
        return null;
    }

    const injectionObject: InjectorObject = { name: '', type };
    const startsWithInjectRegExp: RegExp = new RegExp('^inject');

    // injectionNameRegExp = new RegExp(/(?<=name=")[^]+?(?=")/),
    // contains a lookbehind, which is not supported by JS
    const injectionNameRegExp: RegExp = new RegExp(/[\w:\-]?name[\s]*?=[\s]*?("[^"]+"|'[^']+'|\w+)/);

    // This will return everything from the last colon (including the colon)
    const toTypeRegExp: RegExp = new RegExp(':[^:]+$');
    let name: string;
    let toType: mixed;

    if (injectionString === 'inject') {
        // Simple injection
        return injectionObject;
    } else if (injectionString.match(startsWithInjectRegExp)) {
        name = injectionNameRegExp.exec(injectionString);
        toType = toTypeRegExp.exec(injectionString);
        injectionObject.name = name !== null && name.length === 2 ? name[1].replace(/"/gm, '') : '';

        // If we did match a type specification, then strip of the colon, else use the input type
        injectionObject.type = toType !== null &&
            toType.length === 1 ? toType[0].replace(':', '') : type;

        return injectionObject;
    }

    return null;
}
