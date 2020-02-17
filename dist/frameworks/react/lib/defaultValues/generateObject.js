"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var captions_1 = require("../captions");
var lib_1 = require("../../../../lib");
var generateCode_1 = require("../generateCode");
function generateObject(_a) {
    var inferedType = _a.inferedType, ast = _a.ast;
    var depth = inferedType.depth;
    if (depth === 1) {
        var compactObject = generateCode_1.generateObjectCode(ast, true);
        if (!lib_1.isTooLongForDefaultValueSummary(compactObject)) {
            return lib_1.createSummaryValue(compactObject);
        }
    }
    return lib_1.createSummaryValue(captions_1.OBJECT_CAPTION, generateCode_1.generateObjectCode(ast));
}
exports.generateObject = generateObject;
