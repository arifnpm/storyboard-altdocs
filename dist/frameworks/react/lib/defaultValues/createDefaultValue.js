"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var captions_1 = require("../captions");
var inspection_1 = require("../inspection");
var isHtmlTag_1 = require("../isHtmlTag");
var lib_1 = require("../../../../lib");
var generateCode_1 = require("../generateCode");
var generateObject_1 = require("./generateObject");
var generateArray_1 = require("./generateArray");
var prettyIdentifier_1 = require("./prettyIdentifier");
function generateFunc(_a) {
    var inferedType = _a.inferedType, ast = _a.ast;
    var identifier = inferedType.identifier;
    if (!lodash_1.isNil(identifier)) {
        return lib_1.createSummaryValue(prettyIdentifier_1.getPrettyIdentifier(inferedType), generateCode_1.generateCode(ast));
    }
    var prettyCaption = generateCode_1.generateCode(ast, true);
    return !lib_1.isTooLongForDefaultValueSummary(prettyCaption)
        ? lib_1.createSummaryValue(prettyCaption)
        : lib_1.createSummaryValue(captions_1.FUNCTION_CAPTION, generateCode_1.generateCode(ast));
}
// All elements are JSX elements.
// JSX elements are not supported by escodegen.
function generateElement(defaultValue, inspectionResult) {
    var inferedType = inspectionResult.inferedType;
    var identifier = inferedType.identifier;
    if (!lodash_1.isNil(identifier)) {
        if (!isHtmlTag_1.isHtmlTag(identifier)) {
            var prettyIdentifier = prettyIdentifier_1.getPrettyIdentifier(inferedType);
            return lib_1.createSummaryValue(prettyIdentifier, prettyIdentifier !== defaultValue ? defaultValue : undefined);
        }
    }
    return !lib_1.isTooLongForDefaultValueSummary(defaultValue)
        ? lib_1.createSummaryValue(defaultValue)
        : lib_1.createSummaryValue(captions_1.ELEMENT_CAPTION, defaultValue);
}
function createDefaultValue(defaultValue) {
    try {
        var inspectionResult = inspection_1.inspectValue(defaultValue);
        switch (inspectionResult.inferedType.type) {
            case inspection_1.InspectionType.OBJECT:
                return generateObject_1.generateObject(inspectionResult);
            case inspection_1.InspectionType.FUNCTION:
                return generateFunc(inspectionResult);
            case inspection_1.InspectionType.ELEMENT:
                return generateElement(defaultValue, inspectionResult);
            case inspection_1.InspectionType.ARRAY:
                return generateArray_1.generateArray(inspectionResult);
            default:
                return null;
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return null;
}
exports.createDefaultValue = createDefaultValue;
