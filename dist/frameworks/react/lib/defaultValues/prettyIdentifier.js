"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inspection_1 = require("../inspection");
function getPrettyIdentifier(inferedType) {
    var type = inferedType.type, identifier = inferedType.identifier;
    switch (type) {
        case inspection_1.InspectionType.FUNCTION:
            return getPrettyFuncIdentifier(identifier, inferedType.hasParams);
        case inspection_1.InspectionType.ELEMENT:
            return getPrettyElementIdentifier(identifier);
        default:
            return identifier;
    }
}
exports.getPrettyIdentifier = getPrettyIdentifier;
function getPrettyFuncIdentifier(identifier, hasArguments) {
    return hasArguments ? identifier + "( ... )" : identifier + "()";
}
exports.getPrettyFuncIdentifier = getPrettyFuncIdentifier;
function getPrettyElementIdentifier(identifier) {
    return "<" + identifier + " />";
}
exports.getPrettyElementIdentifier = getPrettyElementIdentifier;
