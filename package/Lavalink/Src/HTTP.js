/*
    Copyright (c) 2021 Andrew Trims and Contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const url = require("url");
const SearchTypes = {
  soundcloud: "scsearch",
  youtube: "ytsearch",
  youtubemusic: "ytmsearch",
};

class LavalinkHTTP {
  constructor() {
    this.requestHeaders = {
        Authorization: null,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (NodeJS; https://nodejs.org/en/)",
    }
  }

  getURL(origin, https) {
    if (https) return new url.URL("https://" + origin);
    return new url.URL("http://" + origin);
    
  }
  /**
   * 
   * @param {string} SearchQuery 
   * @returns 
   */
  load(SearchQuery, origin, password, useHTTPS = false) {
    const url = this.getURL(origin, useHTTPS);
    const src = SearchQuery.split(":").shift();
    if (
      !(
        Object.values(SearchTypes).includes(src)
      )
    )
      throw new TypeError(
        "Search type '" + (src) + "' does not exist!"
      );
    url.pathname = "/loadtracks";
    url.searchParams.append("identifier", SearchQuery);
    return this.do("GET", url, password);
  }

  do(method, url, authorization) {
    const headers = {...this.requestHeaders};
    headers.Authorization = authorization;
    
    let http = require("http");
    if (url.protocol === "https:") http = require("https");

    return new Promise((resolve) => {
      const ClientRequest = http.request(
        {
          method,
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          protocol: url.protocol,
          headers,
        },
        resolve
      );
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
          reject(
            new Error("API Response Status code of '" + message.statusCode + "'")
          );
        }
      });
    });
  }
}

module.exports = new LavalinkHTTP();
