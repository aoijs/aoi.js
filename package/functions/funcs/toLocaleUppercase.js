module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  return {
    code: code.replaceLast(
      `$toLocaleUppercase${inside}`,
      inside
        .inside
        .split(" ")
        .map((word) =>
          word
            .toLowerCase()
            .replace(word.toLowerCase()[0], word[0].toUpperCase())
        )
        .join(" ")
    ),
  };
};
