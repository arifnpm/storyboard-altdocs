"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createType_1 = require("./createType");
var createDefaultValue_1 = require("./createDefaultValue");
exports.createTsPropDef = function (propName, docgenInfo) {
    var description = docgenInfo.description, required = docgenInfo.required;
    return {
        name: propName,
        type: createType_1.createType(docgenInfo),
        required: required,
        description: description,
        defaultValue: createDefaultValue_1.createDefaultValue(docgenInfo),
    };
};
