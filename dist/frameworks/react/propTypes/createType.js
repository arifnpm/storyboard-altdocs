"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var lib_1 = require("../../../lib");
var generateFuncSignature_1 = require("./generateFuncSignature");
var lib_2 = require("../lib");
var inspection_1 = require("../lib/inspection");
var MAX_FUNC_LENGTH = 150;
var PropTypesType;
(function (PropTypesType) {
    PropTypesType["CUSTOM"] = "custom";
    PropTypesType["ANY"] = "any";
    PropTypesType["FUNC"] = "func";
    PropTypesType["SHAPE"] = "shape";
    PropTypesType["OBJECT"] = "object";
    PropTypesType["INSTANCEOF"] = "instanceOf";
    PropTypesType["OBJECTOF"] = "objectOf";
    PropTypesType["UNION"] = "union";
    PropTypesType["ENUM"] = "enum";
    PropTypesType["ARRAYOF"] = "arrayOf";
    PropTypesType["ELEMENT"] = "element";
    PropTypesType["ELEMENTTYPE"] = "elementType";
    PropTypesType["NODE"] = "node";
})(PropTypesType || (PropTypesType = {}));
function createTypeDef(_a) {
    var name = _a.name, short = _a.short, compact = _a.compact, full = _a.full, inferedType = _a.inferedType;
    return {
        name: name,
        short: short,
        compact: compact,
        full: !lodash_1.isNil(full) ? full : short,
        inferedType: inferedType,
    };
}
function cleanPropTypes(value) {
    return value.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
}
function splitIntoLines(value) {
    return value.split(/\r?\n/);
}
function prettyObject(ast, compact) {
    if (compact === void 0) { compact = false; }
    return cleanPropTypes(lib_2.generateObjectCode(ast, compact));
}
function prettyArray(ast, compact) {
    if (compact === void 0) { compact = false; }
    return cleanPropTypes(lib_2.generateCode(ast, compact));
}
function getCaptionForInspectionType(type) {
    switch (type) {
        case inspection_1.InspectionType.OBJECT:
            return lib_2.OBJECT_CAPTION;
        case inspection_1.InspectionType.ARRAY:
            return lib_2.ARRAY_CAPTION;
        case inspection_1.InspectionType.CLASS:
            return lib_2.CLASS_CAPTION;
        case inspection_1.InspectionType.FUNCTION:
            return lib_2.FUNCTION_CAPTION;
        case inspection_1.InspectionType.ELEMENT:
            return lib_2.ELEMENT_CAPTION;
        default:
            return lib_2.CUSTOM_CAPTION;
    }
}
function generateTypeFromString(value, originalTypeName) {
    var _a = inspection_1.inspectValue(value), inferedType = _a.inferedType, ast = _a.ast;
    var type = inferedType.type;
    var short;
    var compact;
    var full;
    switch (type) {
        case inspection_1.InspectionType.IDENTIFIER:
        case inspection_1.InspectionType.LITERAL:
            short = value;
            compact = value;
            break;
        case inspection_1.InspectionType.OBJECT: {
            var depth = inferedType.depth;
            short = lib_2.OBJECT_CAPTION;
            compact = depth === 1 ? prettyObject(ast, true) : null;
            full = prettyObject(ast);
            break;
        }
        case inspection_1.InspectionType.ELEMENT: {
            var identifier = inferedType.identifier;
            short = !lodash_1.isNil(identifier) && !lib_2.isHtmlTag(identifier) ? identifier : lib_2.ELEMENT_CAPTION;
            compact = splitIntoLines(value).length === 1 ? value : null;
            full = value;
            break;
        }
        case inspection_1.InspectionType.ARRAY: {
            var depth = inferedType.depth;
            short = lib_2.ARRAY_CAPTION;
            compact = depth <= 2 ? prettyArray(ast, true) : null;
            full = prettyArray(ast);
            break;
        }
        default:
            short = getCaptionForInspectionType(type);
            compact = splitIntoLines(value).length === 1 ? value : null;
            full = value;
            break;
    }
    return createTypeDef({
        name: originalTypeName,
        short: short,
        compact: compact,
        full: full,
        inferedType: type,
    });
}
function generateCustom(_a) {
    var raw = _a.raw;
    if (!lodash_1.isNil(raw)) {
        return generateTypeFromString(raw, PropTypesType.CUSTOM);
    }
    return createTypeDef({
        name: PropTypesType.CUSTOM,
        short: lib_2.CUSTOM_CAPTION,
        compact: lib_2.CUSTOM_CAPTION,
    });
}
function generateFunc(extractedProp) {
    var jsDocTags = extractedProp.jsDocTags;
    if (!lodash_1.isNil(jsDocTags)) {
        if (!lodash_1.isNil(jsDocTags.params) || !lodash_1.isNil(jsDocTags.returns)) {
            return createTypeDef({
                name: PropTypesType.FUNC,
                short: generateFuncSignature_1.generateShortFuncSignature(jsDocTags.params, jsDocTags.returns),
                compact: null,
                full: generateFuncSignature_1.generateFuncSignature(jsDocTags.params, jsDocTags.returns),
            });
        }
    }
    return createTypeDef({
        name: PropTypesType.FUNC,
        short: lib_2.FUNCTION_CAPTION,
        compact: lib_2.FUNCTION_CAPTION,
    });
}
function generateShape(type, extractedProp) {
    var fields = Object.keys(type.value)
        .map(function (key) { return key + ": " + generateType(type.value[key], extractedProp).full; })
        .join(', ');
    var _a = inspection_1.inspectValue("{ " + fields + " }"), inferedType = _a.inferedType, ast = _a.ast;
    var depth = inferedType.depth;
    return createTypeDef({
        name: PropTypesType.SHAPE,
        short: lib_2.OBJECT_CAPTION,
        compact: depth === 1 ? prettyObject(ast, true) : null,
        full: prettyObject(ast),
    });
}
function objectOf(of) {
    return "objectOf(" + of + ")";
}
function generateObjectOf(type, extractedProp) {
    var _a = generateType(type.value, extractedProp), short = _a.short, compact = _a.compact, full = _a.full;
    return createTypeDef({
        name: PropTypesType.OBJECTOF,
        short: objectOf(short),
        compact: !lodash_1.isNil(compact) ? objectOf(compact) : null,
        full: objectOf(full),
    });
}
function generateUnion(type, extractedProp) {
    if (Array.isArray(type.value)) {
        var values = type.value.reduce(function (acc, v) {
            var _a = generateType(v, extractedProp), short = _a.short, compact = _a.compact, full = _a.full;
            acc.short.push(short);
            acc.compact.push(compact);
            acc.full.push(full);
            return acc;
        }, { short: [], compact: [], full: [] });
        return createTypeDef({
            name: PropTypesType.UNION,
            short: values.short.join(' | '),
            compact: values.compact.every(function (x) { return !lodash_1.isNil(x); }) ? values.compact.join(' | ') : null,
            full: values.full.join(' | '),
        });
    }
    return createTypeDef({ name: PropTypesType.UNION, short: type.value, compact: null });
}
function generateEnumValue(_a) {
    var value = _a.value, computed = _a.computed;
    return computed
        ? generateTypeFromString(value, 'enumvalue')
        : createTypeDef({ name: 'enumvalue', short: value, compact: value });
}
function generateEnum(type) {
    if (Array.isArray(type.value)) {
        var values = type.value.reduce(function (acc, v) {
            var _a = generateEnumValue(v), short = _a.short, compact = _a.compact, full = _a.full;
            acc.short.push(short);
            acc.compact.push(compact);
            acc.full.push(full);
            return acc;
        }, { short: [], compact: [], full: [] });
        return createTypeDef({
            name: PropTypesType.ENUM,
            short: values.short.join(' | '),
            compact: values.compact.every(function (x) { return !lodash_1.isNil(x); }) ? values.compact.join(' | ') : null,
            full: values.full.join(' | '),
        });
    }
    return createTypeDef({ name: PropTypesType.ENUM, short: type.value, compact: type.value });
}
function braceAfter(of) {
    return of + "[]";
}
function braceAround(of) {
    return "[" + of + "]";
}
function createArrayOfObjectTypeDef(short, compact, full) {
    return createTypeDef({
        name: PropTypesType.ARRAYOF,
        short: braceAfter(short),
        compact: !lodash_1.isNil(compact) ? braceAround(compact) : null,
        full: braceAround(full),
    });
}
function generateArray(type, extractedProp) {
    var _a = generateType(type.value, extractedProp), name = _a.name, short = _a.short, compact = _a.compact, full = _a.full, inferedType = _a.inferedType;
    if (name === PropTypesType.CUSTOM) {
        if (inferedType === inspection_1.InspectionType.OBJECT) {
            return createArrayOfObjectTypeDef(short, compact, full);
        }
    }
    else if (name === PropTypesType.SHAPE) {
        return createArrayOfObjectTypeDef(short, compact, full);
    }
    return createTypeDef({
        name: PropTypesType.ARRAYOF,
        short: braceAfter(short),
        compact: braceAfter(short),
    });
}
function generateType(type, extractedProp) {
    try {
        switch (type.name) {
            case PropTypesType.CUSTOM:
                return generateCustom(type);
            case PropTypesType.FUNC:
                return generateFunc(extractedProp);
            case PropTypesType.SHAPE:
                return generateShape(type, extractedProp);
            case PropTypesType.INSTANCEOF:
                return createTypeDef({
                    name: PropTypesType.INSTANCEOF,
                    short: type.value,
                    compact: type.value,
                });
            case PropTypesType.OBJECTOF:
                return generateObjectOf(type, extractedProp);
            case PropTypesType.UNION:
                return generateUnion(type, extractedProp);
            case PropTypesType.ENUM:
                return generateEnum(type);
            case PropTypesType.ARRAYOF:
                return generateArray(type, extractedProp);
            default:
                return createTypeDef({ name: type.name, short: type.name, compact: type.name });
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return createTypeDef({ name: 'unknown', short: 'unknown', compact: 'unknown' });
}
function createType(extractedProp) {
    var type = extractedProp.docgenInfo.type;
    // A type could be null if a defaultProp has been provided without a type definition.
    if (lodash_1.isNil(type)) {
        return null;
    }
    try {
        switch (type.name) {
            case PropTypesType.CUSTOM:
            case PropTypesType.SHAPE:
            case PropTypesType.INSTANCEOF:
            case PropTypesType.OBJECTOF:
            case PropTypesType.UNION:
            case PropTypesType.ENUM:
            case PropTypesType.ARRAYOF: {
                var _a = generateType(type, extractedProp), short = _a.short, compact = _a.compact, full = _a.full;
                if (!lodash_1.isNil(compact)) {
                    if (!lib_1.isTooLongForTypeSummary(compact)) {
                        return lib_1.createSummaryValue(compact);
                    }
                }
                return lib_1.createSummaryValue(short, short !== full ? full : undefined);
            }
            case PropTypesType.FUNC: {
                var _b = generateType(type, extractedProp), short = _b.short, full = _b.full;
                var summary = short;
                var detail = void 0;
                if (full.length < MAX_FUNC_LENGTH) {
                    summary = full;
                }
                else {
                    detail = generateFuncSignature_1.toMultilineSignature(full);
                }
                return lib_1.createSummaryValue(summary, detail);
            }
            default:
                return null;
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return null;
}
exports.createType = createType;
