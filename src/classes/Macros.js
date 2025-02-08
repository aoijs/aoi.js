class MacrosManager {
    /**
     * @type {Map<string, import("..").MacroOptions>}
     */
    cache = new Map();

    /**
     * Adds a macro to the manager.
     * @param {import("..").MacroOptions} macro - The macro to be added.
     * @returns {this}
     */
    add(macro) {
        macro.name = macro.name.startsWith("#")
            ? macro.name.slice(1)
            : macro.name;

        this.cache.set(macro.name, macro);

        return this;
    }

    /**
     * Adds many macros to the manager.
     * @param {import("..").MacroOptions[]} macros - The macros to be added.
     * @returns {this}
     */
    addMany(macros) {
        for (const macro of macros) {
            this.add(macro);
        }
        return this;
    }

    /**
     * Get a macro.
     * @param {string | ((macro: import("..").MacroOptions) => boolean)} name - The name of the macro.
     * @returns {?import("..").MacroOptions}
     */
    get(name) {
        if (typeof name === "string") return this.cache.get(name) || null;

        return this.toArray().find(name) || null;
    }

    /**
     * Return the list of cached macro names.
     * @returns {string[]}
     */
    list() {
        return [...this.cache.keys()];
    }

    /**
     * Return an array of cached macros.
     * @returns {import("..").MacroOptions[]}
     */
    toArray() {
        return [...this.cache.values()];
    }
};

/**
 * Creates a pattern to match the cached macros.
 * @param {string[]} names - The names of the macros.
 * @returns {RegExp}
 */
function createMacrosPattern(names) {
    return new RegExp(`(${names.map(name => `#${name}`).join("|")})`, "g");
};

/**
 * Check whether the given code has macros inside.
 * @param {string[]} names - The names of the cached macros.
 * @param {string} code - The code to be tested.
 * @returns {boolean}
 */
function hasMacros(names, code) {
    return Array.isArray(code.match(createMacrosPattern(names)))
};

/**
 * Resolve the macros in the command code with actual code.
 * @param {import("..").MacroOptions[]} macros - The cached macros.
 * @param {string} code - The code to be resolved.
 * @returns {string}
 */
function resolveMacros(macros, code) {
    if (macros.length === 0) return code;

    const matchedMacros = [...new Set(code.match(createMacrosPattern(macros.map(m => m.name))) ?? [])];
    let newCode = code;

    for (const matchedMacro of matchedMacros) {
        const gotMacro = macros.find(macro => macro.name === matchedMacro.slice(1))
        if (!gotMacro) continue;

        newCode = newCode.replace(
            createMacrosPattern(
                [matchedMacro.slice(1)]
            ),
            gotMacro.code
        );
    }

    return newCode;
};

module.exports = {
    hasMacros,
    MacrosManager,
    resolveMacros
};