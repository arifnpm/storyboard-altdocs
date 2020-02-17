"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = require("../../utils");
var defaultValue_1 = require("../utils/defaultValue");
function createDefaultValue(_a) {
    var defaultValue = _a.defaultValue;
    if (!lodash_1.isNil(defaultValue)) {
        var value = defaultValue.value;
        if (!defaultValue_1.isDefaultValueBlacklisted(value)) {
            return utils_1.createSummaryValue(value);
        }
    }
    return null;
}
exports.createDefaultValue = createDefaultValue;
