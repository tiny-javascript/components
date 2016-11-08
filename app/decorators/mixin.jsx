const {defineProperty, getPrototypeOf} = Object;
const {getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols} = Object;
const getOwnKeys = getOwnPropertySymbols && function(object) {
    return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
} || getOwnPropertyNames;
function getOwnPropertyDescriptors(obj) {
    const descs = {};
    getOwnKeys(obj).forEach(key => (descs[key] = getOwnPropertyDescriptor(obj, key)));
    return descs;
}
function buggySymbol(symbol) {
    return Object.prototype.toString.call(symbol) === '[object Symbol]' && typeof(symbol) === 'object';
}
function hasProperty(prop, obj) {
    if (buggySymbol(prop)) {
        do {
            if (obj === Object.prototype) {
                return typeof(obj[prop]) !== 'undefined';
            }
            if (obj.hasOwnProperty(prop)) {
                return true;
            }
        } while (obj = getPrototypeOf(obj));
        return false;
    } else {
        return prop in obj;
    }
}
function handleClass(target, mixins) {
    if (!mixins.length) {
        throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
    }
    for (let i = 0, l = mixins.length; i < l; i++) {
        const descs = getOwnPropertyDescriptors(mixins[i]);
        for (const key of getOwnKeys(descs)) {
            if (!(hasProperty(key, target.prototype))) {
                defineProperty(target.prototype, key, descs[key]);
            }
        }
    }
}
export default function mixin(...mixins) {
    if (typeof mixins[0] === 'function') {
        return handleClass(mixins[0], []);
    } else {
        return target => {
            return handleClass(target, mixins);
        };
    }
}
