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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
// @ts-ignore
var react_element_to_jsx_string_1 = __importDefault(require("react-element-to-jsx-string"));
var lib_1 = require("../../../../lib");
var inspection_1 = require("../inspection");
var generateObject_1 = require("./generateObject");
var generateArray_1 = require("./generateArray");
var prettyIdentifier_1 = require("./prettyIdentifier");
var captions_1 = require("../captions");
var isHtmlTag_1 = require("../isHtmlTag");
function isReactElement(element) {
    return !lodash_1.isNil(element.$$typeof);
}
function extractFunctionName(func, propName) {
    var name = func.name;
    // Comparison with the prop name is to discard inferred function names.
    if (name !== '' && name !== 'anoynymous' && name !== propName) {
        return name;
    }
    return null;
}
exports.extractFunctionName = extractFunctionName;
var stringResolver = function (rawDefaultProp) {
    return lib_1.createSummaryValue(rawDefaultProp);
};
function generateReactObject(rawDefaultProp) {
    var type = rawDefaultProp.type;
    var displayName = type.displayName;
    var jsx = react_element_to_jsx_string_1.default(rawDefaultProp);
    if (!lodash_1.isNil(displayName)) {
        var prettyIdentifier = prettyIdentifier_1.getPrettyElementIdentifier(displayName);
        return lib_1.createSummaryValue(prettyIdentifier, prettyIdentifier !== jsx ? jsx : undefined);
    }
    if (lodash_1.isString(type)) {
        // This is an HTML element.
        if (isHtmlTag_1.isHtmlTag(type)) {
            var jsxCompact = react_element_to_jsx_string_1.default(rawDefaultProp, { tabStop: 0 });
            var jsxSummary = jsxCompact.replace(/\r?\n|\r/g, '');
            if (!lib_1.isTooLongForDefaultValueSummary(jsxSummary)) {
                return lib_1.createSummaryValue(jsxSummary);
            }
        }
    }
    return lib_1.createSummaryValue(captions_1.ELEMENT_CAPTION, jsx);
}
var objectResolver = function (rawDefaultProp) {
    if (isReactElement(rawDefaultProp) && !lodash_1.isNil(rawDefaultProp.type)) {
        return generateReactObject(rawDefaultProp);
    }
    if (lodash_1.isPlainObject(rawDefaultProp)) {
        var inspectionResult = inspection_1.inspectValue(JSON.stringify(rawDefaultProp));
        return generateObject_1.generateObject(inspectionResult);
    }
    if (lodash_1.isArray(rawDefaultProp)) {
        var inspectionResult = inspection_1.inspectValue(JSON.stringify(rawDefaultProp));
        return generateArray_1.generateArray(inspectionResult);
    }
    return lib_1.createSummaryValue(captions_1.OBJECT_CAPTION);
};
var functionResolver = function (rawDefaultProp, propDef) {
    var isElement = false;
    var inspectionResult;
    // Try to display the name of the component. The body of the component is ommited since the code has been transpiled.
    if (lodash_1.isFunction(rawDefaultProp.render)) {
        isElement = true;
    }
    else if (!lodash_1.isNil(rawDefaultProp.prototype) && lodash_1.isFunction(rawDefaultProp.prototype.render)) {
        isElement = true;
    }
    else {
        var innerElement = void 0;
        try {
            inspectionResult = inspection_1.inspectValue(rawDefaultProp.toString());
            var _a = inspectionResult.inferedType, hasParams = _a.hasParams, params = _a.params;
            if (hasParams) {
                // It might be a functional component accepting props.
                if (params.length === 1 && params[0].type === 'ObjectPattern') {
                    innerElement = rawDefaultProp({});
                }
            }
            else {
                innerElement = rawDefaultProp();
            }
            if (!lodash_1.isNil(innerElement)) {
                if (isReactElement(innerElement)) {
                    isElement = true;
                }
            }
        }
        catch (e) {
            // do nothing.
        }
    }
    var funcName = extractFunctionName(rawDefaultProp, propDef.name);
    if (!lodash_1.isNil(funcName)) {
        if (isElement) {
            return lib_1.createSummaryValue(prettyIdentifier_1.getPrettyElementIdentifier(funcName));
        }
        if (!lodash_1.isNil(inspectionResult)) {
            inspectionResult = inspection_1.inspectValue(rawDefaultProp.toString());
        }
        var hasParams = inspectionResult.inferedType.hasParams;
        return lib_1.createSummaryValue(prettyIdentifier_1.getPrettyFuncIdentifier(funcName, hasParams));
    }
    return lib_1.createSummaryValue(isElement ? captions_1.ELEMENT_CAPTION : captions_1.FUNCTION_CAPTION);
};
var defaultResolver = function (rawDefaultProp) {
    return lib_1.createSummaryValue(rawDefaultProp.toString());
};
var DEFAULT_TYPE_RESOLVERS = {
    string: stringResolver,
    object: objectResolver,
    function: functionResolver,
    default: defaultResolver,
};
function createTypeResolvers(customResolvers) {
    if (customResolvers === void 0) { customResolvers = {}; }
    return __assign(__assign({}, DEFAULT_TYPE_RESOLVERS), customResolvers);
}
exports.createTypeResolvers = createTypeResolvers;
// When react-docgen cannot provide a defaultValue we take it from the raw defaultProp.
// It works fine for types that are not transpiled. For the types that are transpiled, we can only provide partial support.
// This means that:
//   - The detail might not be available.
//   - Identifiers might not be "prettified" for all the types.
function createDefaultValueFromRawDefaultProp(rawDefaultProp, propDef, typeResolvers) {
    if (typeResolvers === void 0) { typeResolvers = DEFAULT_TYPE_RESOLVERS; }
    try {
        // Keep the extra () otherwise it will fail for functions.
        // eslint-disable-next-line prettier/prettier
        switch (typeof (rawDefaultProp)) {
            case 'string':
                return typeResolvers.string(rawDefaultProp, propDef);
            case 'object':
                return typeResolvers.object(rawDefaultProp, propDef);
            case 'function': {
                return typeResolvers.function(rawDefaultProp, propDef);
            }
            default:
                return typeResolvers.default(rawDefaultProp, propDef);
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return null;
}
exports.createDefaultValueFromRawDefaultProp = createDefaultValueFromRawDefaultProp;
