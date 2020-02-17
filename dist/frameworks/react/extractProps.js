"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = __importDefault(require("prop-types"));
var react_is_1 = require("react-is");
var docgen_1 = require("../../lib/docgen");
var handleProp_1 = require("./propTypes/handleProp");
var handleProp_2 = require("./typeScript/handleProp");
var propTypesMap = new Map();
Object.keys(prop_types_1.default).forEach(function (typeName) {
    // @ts-ignore
    var type = prop_types_1.default[typeName];
    propTypesMap.set(type, typeName);
    propTypesMap.set(type.isRequired, typeName);
});
function getPropDefs(component, section) {
    var processedComponent = component;
    // eslint-disable-next-line react/forbid-foreign-prop-types
    if (!docgen_1.hasDocgen(component) && !component.propTypes) {
        if (react_is_1.isForwardRef(component) || component.render) {
            processedComponent = component.render().type;
        }
        if (react_is_1.isMemo(component)) {
            processedComponent = component.type().type;
        }
    }
    var extractedProps = docgen_1.extractComponentProps(processedComponent, section);
    if (extractedProps.length === 0) {
        return [];
    }
    switch (extractedProps[0].typeSystem) {
        case docgen_1.TypeSystem.JAVASCRIPT:
            return handleProp_1.enhancePropTypesProps(extractedProps, component);
        case docgen_1.TypeSystem.TYPESCRIPT:
            return handleProp_2.enhanceTypeScriptProps(extractedProps);
        default:
            return extractedProps.map(function (x) { return x.propDef; });
    }
}
exports.extractProps = function (component) { return ({
    rows: getPropDefs(component, 'props'),
}); };
