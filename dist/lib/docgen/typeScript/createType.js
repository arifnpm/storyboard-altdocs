"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = require("../../utils");
function createType(_a) {
    var tsType = _a.tsType, required = _a.required;
    // A type could be null if a defaultProp has been provided without a type definition.
    if (lodash_1.isNil(tsType)) {
        return null;
    }
    if (!required) {
        return utils_1.createSummaryValue(tsType.name.replace(' | undefined', ''));
    }
    return utils_1.createSummaryValue(tsType.name);
}
exports.createType = createType;
