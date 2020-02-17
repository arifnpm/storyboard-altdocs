"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var defaultValues_1 = require("../lib/defaultValues");
var lib_1 = require("../../../lib");
var lib_2 = require("../lib");
var prettyIdentifier_1 = require("../lib/defaultValues/prettyIdentifier");
var inspection_1 = require("../lib/inspection");
var funcResolver = function (rawDefaultProp, _a) {
    var name = _a.name, type = _a.type;
    var isElement = type.summary === 'element' || type.summary === 'elementType';
    var funcName = defaultValues_1.extractFunctionName(rawDefaultProp, name);
    if (!lodash_1.isNil(funcName)) {
        // Try to display the name of the component. The body of the component is ommited since the code has been transpiled.
        if (isElement) {
            return lib_1.createSummaryValue(prettyIdentifier_1.getPrettyElementIdentifier(funcName));
        }
        var hasParams = inspection_1.inspectValue(rawDefaultProp.toString()).inferedType.hasParams;
        return lib_1.createSummaryValue(prettyIdentifier_1.getPrettyFuncIdentifier(funcName, hasParams));
    }
    return lib_1.createSummaryValue(isElement ? lib_2.ELEMENT_CAPTION : lib_2.FUNCTION_CAPTION);
};
exports.rawDefaultPropTypeResolvers = defaultValues_1.createTypeResolvers({
    function: funcResolver,
});
