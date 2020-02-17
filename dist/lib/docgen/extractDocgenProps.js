"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var jsdocParser_1 = require("../jsdocParser");
var types_1 = require("./types");
var utils_1 = require("./utils");
var createPropDef_1 = require("./createPropDef");
var getTypeSystem = function (docgenInfo) {
    if (!lodash_1.isNil(docgenInfo.type)) {
        return types_1.TypeSystem.JAVASCRIPT;
    }
    if (!lodash_1.isNil(docgenInfo.flowType)) {
        return types_1.TypeSystem.FLOW;
    }
    if (!lodash_1.isNil(docgenInfo.tsType)) {
        return types_1.TypeSystem.TYPESCRIPT;
    }
    return types_1.TypeSystem.UNKNOWN;
};
exports.extractComponentSectionArray = function (docgenSection) {
    var typeSystem = getTypeSystem(docgenSection[0]);
    var createPropDef = createPropDef_1.getPropDefFactory(typeSystem);
    return docgenSection
        .map(function (item) { return extractProp(item.name, item, typeSystem, createPropDef); })
        .filter(Boolean);
};
exports.extractComponentSectionObject = function (docgenSection) {
    var docgenPropsKeys = Object.keys(docgenSection);
    var typeSystem = getTypeSystem(docgenSection[docgenPropsKeys[0]]);
    var createPropDef = createPropDef_1.getPropDefFactory(typeSystem);
    return docgenPropsKeys
        .map(function (propName) {
        var docgenInfo = docgenSection[propName];
        return !lodash_1.isNil(docgenInfo)
            ? extractProp(propName, docgenInfo, typeSystem, createPropDef)
            : null;
    })
        .filter(Boolean);
};
exports.extractComponentProps = function (component, section) {
    var docgenSection = utils_1.getDocgenSection(component, section);
    if (!utils_1.isValidDocgenSection(docgenSection)) {
        return [];
    }
    // vue-docgen-api has diverged from react-docgen and returns an array
    return Array.isArray(docgenSection)
        ? exports.extractComponentSectionArray(docgenSection)
        : exports.extractComponentSectionObject(docgenSection);
};
function extractProp(propName, docgenInfo, typeSystem, createPropDef) {
    var jsDocParsingResult = jsdocParser_1.parseJsDoc(docgenInfo.description);
    var isIgnored = jsDocParsingResult.includesJsDoc && jsDocParsingResult.ignore;
    if (!isIgnored) {
        var propDef = createPropDef(propName, docgenInfo, jsDocParsingResult);
        return {
            propDef: propDef,
            jsDocTags: jsDocParsingResult.extractedTags,
            docgenInfo: docgenInfo,
            typeSystem: typeSystem,
        };
    }
    return null;
}
function extractComponentDescription(component) {
    return !lodash_1.isNil(component) && utils_1.getDocgenDescription(component);
}
exports.extractComponentDescription = extractComponentDescription;
