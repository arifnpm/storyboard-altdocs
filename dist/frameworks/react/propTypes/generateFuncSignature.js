"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function generateFuncSignature(params, returns) {
    var hasParams = !lodash_1.isNil(params);
    var hasReturns = !lodash_1.isNil(returns);
    if (!hasParams && !hasReturns) {
        return '';
    }
    var funcParts = [];
    if (hasParams) {
        var funcParams = params.map(function (x) {
            var prettyName = x.getPrettyName();
            var typeName = x.getTypeName();
            if (!lodash_1.isNil(typeName)) {
                return prettyName + ": " + typeName;
            }
            return prettyName;
        });
        funcParts.push("(" + funcParams.join(', ') + ")");
    }
    else {
        funcParts.push('()');
    }
    if (hasReturns) {
        funcParts.push("=> " + returns.getTypeName());
    }
    return funcParts.join(' ');
}
exports.generateFuncSignature = generateFuncSignature;
function generateShortFuncSignature(params, returns) {
    var hasParams = !lodash_1.isNil(params);
    var hasReturns = !lodash_1.isNil(returns);
    if (!hasParams && !hasReturns) {
        return '';
    }
    var funcParts = [];
    if (hasParams) {
        funcParts.push('( ... )');
    }
    else {
        funcParts.push('()');
    }
    if (hasReturns) {
        funcParts.push("=> " + returns.getTypeName());
    }
    return funcParts.join(' ');
}
exports.generateShortFuncSignature = generateShortFuncSignature;
function toMultilineSignature(signature) {
    return signature.replace(/,/g, ',\r\n');
}
exports.toMultilineSignature = toMultilineSignature;
