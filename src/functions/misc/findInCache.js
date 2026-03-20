/**
 * 安全なプロパティアクセス（eval RCE対策）
 */
function safeGet(obj, path) {
    if (!path || path.trim() === "") return obj;
    return path.replace(/^\??\./, "").split(".").filter(Boolean).reduce((o, k) => o?.[k], obj);
}

/**
 * 比較演算を安全に実行する
 */
function safeCompare(a, b, op) {
    switch (op) {
        case "===": return a === b;
        case "==": return a == b;
        case ">=": return a >= b;
        case "<=": return a <= b;
        case ">": return a > b;
        case "<": return a < b;
        default: return false;
    }
}

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [type, name, prop, value, findType = "===", returnValue = "$default"] =
        data.inside.splits;

    findType = ["includes", "startsWith", "endsWith"].includes(findType)
        ? findType
        : [">=", "==", "===", "<=", "<", ">"].includes(findType)
            ? findType
            : d.aoiError.fnError(
                d,
                "custom",
                {inside: data.inside},
                "Invalid FindType Provided In",
            );
    try {
        // セキュリティ: eval()の代わりに安全なキャッシュ検索（RCE対策）
        const cache = d.client.cacheManager.caches[type]?.[name];

        if (["includes", "startsWith", "endsWith"].includes(findType)) {
            data.result = cache?.find(x => {
                const target = prop.trim() === "" ? x : safeGet(x, prop);
                return typeof target?.[findType] === "function" && target[findType](value);
            });
        } else {
            data.result = cache?.find(x => {
                const target = prop.trim() === "" ? x : safeGet(x, prop);
                return safeCompare(target, value, findType);
            });
        }

        data.result =
            typeof data.result === "object"
                ? returnValue === "$default"
                    ? JSON.stringify(data.result, null, 2)
                    : safeGet(data.result, returnValue)
                : data.result;
    } catch (e) {
        console.error(e);
        data.result = "";
    }

    return {
        code: d.util.setCode(data),
    };
};