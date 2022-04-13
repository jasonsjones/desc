/**
 * This is a custom override of the 'inherits' pkg (called from jsonwebtokens)
 * to make it compatible with esbuild/vite.  The orig implementation was
 * throwing a typerror:
 *
 *           Object prototype may only be an Object or null: undefined
 */
function inherits(ctor, superCtor) {
    // add early return if the prototype is undefined
    if (!superCtor.prototype) return;
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}

module.exports = inherits;
