"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var createType_1 = require("./createType");
var defaultValues_1 = require("../lib/defaultValues");
var sortProps_1 = require("./sortProps");
var rawDefaultPropResolvers_1 = require("./rawDefaultPropResolvers");
function enhancePropTypesProp(extractedProp, rawDefaultProp) {
    var propDef = extractedProp.propDef;
    var newtype = createType_1.createType(extractedProp);
    if (!lodash_1.isNil(newtype)) {
        propDef.type = newtype;
    }
    var defaultValue = extractedProp.docgenInfo.defaultValue;
    if (!lodash_1.isNil(defaultValue) && !lodash_1.isNil(defaultValue.value)) {
        var newDefaultValue = defaultValues_1.createDefaultValue(defaultValue.value);
        if (!lodash_1.isNil(newDefaultValue)) {
            propDef.defaultValue = newDefaultValue;
        }
    }
    else if (!lodash_1.isNil(rawDefaultProp)) {
        var newDefaultValue = defaultValues_1.createDefaultValueFromRawDefaultProp(rawDefaultProp, propDef, rawDefaultPropResolvers_1.rawDefaultPropTypeResolvers);
        if (!lodash_1.isNil(newDefaultValue)) {
            propDef.defaultValue = newDefaultValue;
        }
    }
    return propDef;
}
exports.enhancePropTypesProp = enhancePropTypesProp;
function enhancePropTypesProps(extractedProps, component) {
    var rawDefaultProps = !lodash_1.isNil(component.defaultProps) ? component.defaultProps : {};
    var enhancedProps = extractedProps.map(function (x) {
        return enhancePropTypesProp(x, rawDefaultProps[x.propDef.name]);
    });
    return sortProps_1.keepOriginalDefinitionOrder(enhancedProps, component);
}
exports.enhancePropTypesProps = enhancePropTypesProps;
