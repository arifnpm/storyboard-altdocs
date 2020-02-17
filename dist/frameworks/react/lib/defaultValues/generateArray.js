"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var captions_1 = require("../captions");
var lib_1 = require("../../../../lib");
var generateCode_1 = require("../generateCode");
function generateArray(_a) {
    var inferedType = _a.inferedType, ast = _a.ast;
    var depth = inferedType.depth;
    if (depth <= 2) {
        var compactArray = generateCode_1.generateArrayCode(ast, true);
        if (!lib_1.isTooLongForDefaultValueSummary(compactArray)) {
            return lib_1.createSummaryValue(compactArray);
        }
    }
    return lib_1.createSummaryValue(captions_1.ARRAY_CAPTION, generateCode_1.generateArrayCode(ast));
}
exports.generateArray = generateArray;
