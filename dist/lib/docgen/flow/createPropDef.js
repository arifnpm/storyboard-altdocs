"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createType_1 = require("./createType");
var createDefaultValue_1 = require("./createDefaultValue");
exports.createFlowPropDef = function (propName, docgenInfo) {
    var flowType = docgenInfo.flowType, description = docgenInfo.description, required = docgenInfo.required, defaultValue = docgenInfo.defaultValue;
    return {
        name: propName,
        type: createType_1.createType(flowType),
        required: required,
        description: description,
        defaultValue: createDefaultValue_1.createDefaultValue(defaultValue, flowType),
    };
};
