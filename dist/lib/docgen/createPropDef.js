"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var types_1 = require("./types");
var utils_1 = require("../utils");
var createPropDef_1 = require("./flow/createPropDef");
var defaultValue_1 = require("./utils/defaultValue");
var createPropDef_2 = require("./typeScript/createPropDef");
function createType(type) {
    // A type could be null if a defaultProp has been provided without a type definition.
    return !lodash_1.isNil(type) ? utils_1.createSummaryValue(type.name) : null;
}
function createDefaultValue(defaultValue) {
    if (!lodash_1.isNil(defaultValue)) {
        var value = defaultValue.value;
        if (!defaultValue_1.isDefaultValueBlacklisted(value)) {
            return utils_1.createSummaryValue(value);
        }
    }
    return null;
}
function createBasicPropDef(name, type, docgenInfo) {
    var description = docgenInfo.description, required = docgenInfo.required, defaultValue = docgenInfo.defaultValue;
    return {
        name: name,
        type: createType(type),
        required: required,
        description: description,
        defaultValue: createDefaultValue(defaultValue),
    };
}
function applyJsDocResult(propDef, jsDocParsingResult) {
    if (jsDocParsingResult.includesJsDoc) {
        var description = jsDocParsingResult.description, extractedTags = jsDocParsingResult.extractedTags;
        if (!lodash_1.isNil(description)) {
            // eslint-disable-next-line no-param-reassign
            propDef.description = jsDocParsingResult.description;
        }
        var hasParams = !lodash_1.isNil(extractedTags.params);
        var hasReturns = !lodash_1.isNil(extractedTags.returns) && !lodash_1.isNil(extractedTags.returns.type);
        if (hasParams || hasReturns) {
            // eslint-disable-next-line no-param-reassign
            propDef.jsDocTags = {
                params: hasParams &&
                    extractedTags.params.map(function (x) { return ({ name: x.getPrettyName(), description: x.description }); }),
                returns: hasReturns && { description: extractedTags.returns.description },
            };
        }
    }
    return propDef;
}
exports.javaScriptFactory = function (propName, docgenInfo, jsDocParsingResult) {
    var propDef = createBasicPropDef(propName, docgenInfo.type, docgenInfo);
    return applyJsDocResult(propDef, jsDocParsingResult);
};
exports.tsFactory = function (propName, docgenInfo, jsDocParsingResult) {
    var propDef = createPropDef_2.createTsPropDef(propName, docgenInfo);
    return applyJsDocResult(propDef, jsDocParsingResult);
};
exports.flowFactory = function (propName, docgenInfo, jsDocParsingResult) {
    var propDef = createPropDef_1.createFlowPropDef(propName, docgenInfo);
    return applyJsDocResult(propDef, jsDocParsingResult);
};
exports.unknownFactory = function (propName, docgenInfo, jsDocParsingResult) {
    var propDef = createBasicPropDef(propName, { name: 'unknown' }, docgenInfo);
    return applyJsDocResult(propDef, jsDocParsingResult);
};
exports.getPropDefFactory = function (typeSystem) {
    switch (typeSystem) {
        case types_1.TypeSystem.JAVASCRIPT:
            return exports.javaScriptFactory;
        case types_1.TypeSystem.TYPESCRIPT:
            return exports.tsFactory;
        case types_1.TypeSystem.FLOW:
            return exports.flowFactory;
        default:
            return exports.unknownFactory;
    }
};
