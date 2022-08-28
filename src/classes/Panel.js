try {
  const { Panel } = require("@akarui/aoi.panel");
  module.exports = Panel;
} catch (e) {
  class Panel {
    constructor() {
      throw new Error("Install @akarui/aoi.panel to use this feature");
    }
  }
  module.exports = Panel;
}
