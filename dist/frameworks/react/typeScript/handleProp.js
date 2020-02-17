"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var defaultValues_1 = require("../lib/defaultValues");
function enhanceTypeScriptProp(extractedProp, rawDefaultProp) {
    var propDef = extractedProp.propDef;
    var defaultValue = extractedProp.docgenInfo.defaultValue;
    if (!lodash_1.isNil(defaultValue) && !lodash_1.isNil(defaultValue.value)) {
        var newDefaultValue = defaultValues_1.createDefaultValue(defaultValue.value);
        if (!lodash_1.isNil(newDefaultValue)) {
            propDef.defaultValue = newDefaultValue;
        }
    }
    else if (!lodash_1.isNil(rawDefaultProp)) {
        var newDefaultValue = defaultValues_1.createDefaultValueFromRawDefaultProp(rawDefaultProp, propDef);
        if (!lodash_1.isNil(newDefaultValue)) {
            propDef.defaultValue = newDefaultValue;
        }
    }
    return propDef;
}
exports.enhanceTypeScriptProp = enhanceTypeScriptProp;
function enhanceTypeScriptProps(extractedProps) {
    return extractedProps.map(enhanceTypeScriptProp);
}
exports.enhanceTypeScriptProps = enhanceTypeScriptProps;
