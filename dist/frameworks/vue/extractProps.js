"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docgen_1 = require("../../lib/docgen");
var SECTIONS = ['props', 'events', 'slots'];
exports.extractProps = function (component) {
    if (!docgen_1.hasDocgen(component)) {
        return null;
    }
    var sections = {};
    SECTIONS.forEach(function (section) {
        sections[section] = docgen_1.extractComponentProps(component, section).map(function (x) { return x.propDef; });
    });
    return { sections: sections };
};
