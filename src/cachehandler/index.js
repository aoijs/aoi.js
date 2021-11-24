const Group = require("./group.js");
const LimitGroup = require("./limitGroup.js");
const SuperSet = require("./superSet.js");
module.exports = {
    cache: Group,
    limitedCache: LimitGroup,
    setCache: SuperSet,
};
