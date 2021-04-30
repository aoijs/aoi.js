const http = require("http");
const url = require("url");
const SearchTypes = {
  soundcloud: "scsearch",
  youtube: "ytsearch",
  youtubemusic: "ytmsearch",
};
class LavalinkHTTP {
  constructor(url, password, options) {
    (this.url = url), (this.password = password), (this.options = options);
  }

  getURL() {
    return new url.URL("http://" + this.url);
  }

  load(SearchQuery = String) {
    const url = this.getURL();
    if (
      !(
        SearchTypes[SearchQuery.split(":")[0]] ||
        Object.values(SearchTypes).includes(SearchQuery.split(":")[0])
      )
    )
      throw new TypeError(
        "Search type '" + SearchQuery.split(":")[0] + "' does not exist!"
      );
    url.pathname = "/loadtracks";
    url.searchParams.append("identifier", SearchQuery);
    return this.do("GET", url);
  }

  do(method, url, data) {
    return new Promise((resolve) => {
      const ClientRequest = http.request(
        {
          method,
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          protocol: url.protocol,
          headers: {
            Authorization: this.password,
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (dbd.js; https://www.npmjs.com/package/dbd.js)",
          },
        },
        resolve
      );
      if (data) {
        ClientRequest.write(data);
      }
      ClientRequest.end();
    }).then((message) => {
      return new Promise((resolve, reject) => {
        if (
          message.statusCode &&
          message.statusCode >= 200 &&
          message.statusCode < 300
        ) {
          const chunks = [];
          message.on("data", (chunk) => {
            if (typeof chunk === "string") chunk = Buffer.from(chunk);
            chunks.push(chunk);
          });
          message.once("error", reject);
          message.once("end", () => {
            message.removeAllListeners();
            try {
              const data = Buffer.concat(chunks);
              resolve(JSON.parse(data.toString()));
            } catch (e) {
              reject(e);
            }
          });
        } else {
          throw new Error(
            "[HTTP]: Received " +
              message.statusCode +
              " (" +
              http.STATUS_CODES[message.statusCode] +
              ")"
          );
        }
      });
    });
  }
}

module.exports = LavalinkHTTP;
