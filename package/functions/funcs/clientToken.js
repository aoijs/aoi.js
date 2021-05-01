// Copyright 2021 Luey#28
// All rights reserved
const clientToken = (d) => {
  return {
    code: d.command.code.replaceLast("$clientToken", d.client.token),
  };
  // Aoi.js
};

module.exports = clientToken;
