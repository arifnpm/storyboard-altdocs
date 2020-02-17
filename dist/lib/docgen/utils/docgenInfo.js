"use strict";
/* eslint-disable no-underscore-dangle */
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var string_1 = require("./string");
function hasDocgen(component) {
    return !!component.__docgenInfo;
}
exports.hasDocgen = hasDocgen;
function isValidDocgenSection(docgenSection) {
    return !lodash_1.isNil(docgenSection) && Object.keys(docgenSection).length > 0;
}
exports.isValidDocgenSection = isValidDocgenSection;
function getDocgenSection(component, section) {
    return hasDocgen(component) ? component.__docgenInfo[section] : null;
}
exports.getDocgenSection = getDocgenSection;
function getDocgenDescription(component) {
    return hasDocgen(component) && string_1.str(component.__docgenInfo.description);
}
exports.getDocgenDescription = getDocgenDescription;
