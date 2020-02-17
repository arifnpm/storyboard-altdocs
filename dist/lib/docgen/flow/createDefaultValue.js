"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = require("../../utils");
var defaultValue_1 = require("../utils/defaultValue");
function createDefaultValue(defaultValue, type) {
    if (!lodash_1.isNil(defaultValue)) {
        var value = defaultValue.value;
        if (!defaultValue_1.isDefaultValueBlacklisted(value)) {
            return !utils_1.isTooLongForDefaultValueSummary(value)
                ? utils_1.createSummaryValue(value)
                : utils_1.createSummaryValue(type.name, value);
        }
    }
    return null;
}
exports.createDefaultValue = createDefaultValue;
