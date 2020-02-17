"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = require("../../utils");
var FlowTypesType;
(function (FlowTypesType) {
    FlowTypesType["UNION"] = "union";
    FlowTypesType["SIGNATURE"] = "signature";
})(FlowTypesType || (FlowTypesType = {}));
function generateUnion(_a) {
    var name = _a.name, raw = _a.raw, elements = _a.elements;
    if (!lodash_1.isNil(raw)) {
        return utils_1.createSummaryValue(raw);
    }
    if (!lodash_1.isNil(elements)) {
        return utils_1.createSummaryValue(elements.map(function (x) { return x.value; }).join(' | '));
    }
    return utils_1.createSummaryValue(name);
}
function generateFuncSignature(_a) {
    var type = _a.type, raw = _a.raw;
    if (!lodash_1.isNil(raw)) {
        return utils_1.createSummaryValue(raw);
    }
    return utils_1.createSummaryValue(type);
}
function generateObjectSignature(_a) {
    var type = _a.type, raw = _a.raw;
    if (!lodash_1.isNil(raw)) {
        return !utils_1.isTooLongForTypeSummary(raw) ? utils_1.createSummaryValue(raw) : utils_1.createSummaryValue(type, raw);
    }
    return utils_1.createSummaryValue(type);
}
function generateSignature(flowType) {
    var type = flowType.type;
    return type === 'object' ? generateObjectSignature(flowType) : generateFuncSignature(flowType);
}
function generateDefault(_a) {
    var name = _a.name, raw = _a.raw;
    if (!lodash_1.isNil(raw)) {
        return !utils_1.isTooLongForTypeSummary(raw) ? utils_1.createSummaryValue(raw) : utils_1.createSummaryValue(name, raw);
    }
    return utils_1.createSummaryValue(name);
}
function createType(type) {
    // A type could be null if a defaultProp has been provided without a type definition.
    if (lodash_1.isNil(type)) {
        return null;
    }
    switch (type.name) {
        case FlowTypesType.UNION:
            return generateUnion(type);
        case FlowTypesType.SIGNATURE:
            return generateSignature(type);
        default:
            return generateDefault(type);
    }
}
exports.createType = createType;
