function searchIndexes(pat, txt) {
    const patLength = pat.length;
    const txtLength = txt.length;

    const lps = new Array(patLength).fill(0);

    processPattern(pat, patLength, lps);

    const indexes = [];

    let patIndex = 0;
    let txtIndex = 0;

    while (txtIndex < txtLength) {
        if (pat[patIndex] === txt[txtIndex]) {
            ++patIndex;
            ++txtIndex;
        }

        if (patIndex === patLength) {
            indexes.push(txtIndex - patIndex);
            patIndex = lps[patIndex - 1];
        } else if (txtIndex < txtLength && pat[patIndex] !== txt[txtIndex]) {
            if (patIndex !== 0) {
                patIndex = lps[patIndex - 1];
            } else {
                ++txtIndex;
            }
        }
    }

    return indexes;
}

function processPattern(pat, patLength, lps) {
    let len = 0;
    let index = 1;

    while (index < patLength) {
        if (pat[index] === pat[len]) {
            ++len;
            lps[index++] = len;
        } else if (len !== 0) {
            len = lps[len - 1];
        } else {
            lps[index++] = 0;
        }
    }
}

module.exports = searchIndexes;
