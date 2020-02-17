"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var acornParser_1 = require("./acornParser");
var types_1 = require("./types");
function inspectValue(value) {
    try {
        var parsingResult = acornParser_1.parse(value);
        return __assign({}, parsingResult);
    }
    catch (e) {
        // do nothing.
    }
    return { inferedType: { type: types_1.InspectionType.UNKNOWN } };
}
exports.inspectValue = inspectValue;
