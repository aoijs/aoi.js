module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [name, query, queryType = "=="] = data.inside.splits;
  if (!data.arrays[name]) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Array with name '" + name + "' does not exist.",
    );
  }

  data.result = d.arrays[name].every((x) =>
    ["==", "!=", "<=", ">=", "<", ">"].includes(queryType)
      ? d.util.checkCondition.solve(`x${queryType}${query}`)
      : x[queryType](query),
  );

  return {
    code: d.util.setCode(data),
  };
};
