const { Agent, fetch } = require("undici");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [ link ] = data.inside.splits;

  try {
    const response = await fetch(link.addBrackets(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
      agent: new Agent(),
      signal: null,
      timeout: 5000,
    });

    const contentType = response.headers.get("content-type");
    data.result = contentType && contentType.startsWith("image");
  } catch {
    data.result = false;
  }

  return {
    code: d.util.setCode(data),
  };
};
