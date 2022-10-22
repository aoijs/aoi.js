const searchIndexes = require("../../handler/searchIndexes");
const fs = require("fs");
String.prototype.replaceLast = function (find, replace) {
  const index = this.lastIndexOf(find);

  if (index >= 0) {
    return (
      this.substring(0, index) + replace + this.substring(index + find.length)
    );
  }

  return this.toString();
};
String.prototype.deleteBrackets = function () {
  return this.replace(/\[/g, "#RIGHT#")
    .replace(/]/g, "#LEFT#")
    .replace(/;/g, "#SEMI#")
    .replace(/:/g, "#COLON#")
    .replace(/\$/g, "#CHAR#")
    .replace(/>/g, "#RIGHT_CLICK#")
    .replace(/</g, "#LEFT_CLICK#")
    .replace(/=/g, "#EQUAL#")
    .replace(/{/g, "#RIGHT_BRACKET#")
    .replace(/}/g, "#LEFT_BRACKET#")
    .replace(/,/g, "#COMMA#")
    .replace(/\(/g, "#LB#")
    .replace(/\)/g, "#RB#")
    .replace(/&&/g, "#AND#")
    .replaceAll("||", "#OR#");
};

String.prototype.removeBrackets = String.prototype.deleteBrackets;

String.prototype.check = function () {
  return this.trim().replace(/\t/g, "").split(/ +/g)[0][0];
};

String.prototype.after = function () {
  const afterIndex = this.indexOf("[");
  const after = this.replace(/(\s|\n)/gim, "").startsWith("[")
    ? this.split("[").slice(1).join("[")
    : undefined;

  let inside;

  let total = "";

  let splits = [];

  if (after) {
    const before = this.substring(0, afterIndex);

    const rightIndexes = searchIndexes("[", after);
    const leftIndexes = searchIndexes("]", after);

    if (leftIndexes.length === 0) {
      inside = after;
      total = `${before}[${inside}`;
    } else if (rightIndexes.length === 0) {
      inside = after.substring(0, leftIndexes[0]);
      total = `${before}[${inside}]`;
    } else {
      const merged = [];

      let leftIndex = 0;

      for (let i = 0; i < rightIndexes.length; ++i) {
        const right = rightIndexes[i];

        let left = leftIndexes[leftIndex];

        while (left < right && typeof left === "number") {
          merged.push({
            index: left,
            isLeft: true,
          });

          left = leftIndexes[++leftIndex];
        }
        merged.push({
          index: right,
          isLeft: false,
        });

        if (typeof left !== "number") break;
      }

      while (leftIndex < leftIndexes.length) {
        const left = leftIndexes[leftIndex++];

        merged.push({
          index: left,
          isLeft: true,
        });
      }

      let index = 0;
      let depth = 1;

      for (let i = 0; i < merged.length; ++i) {
        const obj = merged[i];

        index = obj.index;

        if (obj.isLeft) --depth;
        else ++depth;

        if (!depth) break;
      }

      if (depth) index = after.length;

      inside = after.substring(0, index);
      total = `${before}[${inside}${depth ? "" : "]"}`;
    }

    splits = inside.split(";");
  }

  return {
    inside,
    total,
    splits,
    toString() {
      return total;
    },
    addBrackets() {
      return inside ? inside.addBrackets() : "";
    },
  };
};

String.prototype.addBrackets = function () {
  return this.replace(/#RIGHT#/g, "[")
    .replace(/#LEFT#/g, "]")
    .replace(/#SEMI#/g, ";")
    .replace(/#COLON#/g, ":")
    .replace(/#CHAR#/g, "$")
    .replace(/#RIGHT_CLICK#/g, ">")
    .replace(/#LEFT_CLICK#/g, "<")
    .replace(/#EQUAL#/g, "=")
    .replace(/#RIGHT_BRACKET#/g, "{")
    .replace(/#LEFT_BRACKET#/g, "}")
    .replace(/#COMMA#/g, ",")
    .replace(/#LB#/g, "(")
    .replace(/#RB#/g, ")")
    .replace(/#AND#/g, "&&")
    .replace(/#OR#/g, "||");
};

Array.prototype.goof = function (sep = "_") {
  return this.map((x) =>
    x
      .split(sep)
      .map((w) =>
        w.toLowerCase().replace(w[0].toLowerCase(), w[0].toUpperCase()),
      )
      .join(" "),
  ).join(", ");
};

async function walk(path) {
  const something = await fs.promises

    .readdir(path, { withFileTypes: true })

    .then((f) => {
      return f.map((d) => {
        d.name = `${path}/${d.name}`;

        return d;
      });
    });

  const files = something.filter((d) => d.isFile());
  const dirs = something.filter((d) => d.isDirectory());

  for (const d of dirs) {
    const items = await walk(d.name);

    files.push(...items);
  }
  return files;
}
