"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var doctrine_1 = __importDefault(require("doctrine"));
var lodash_1 = require("lodash");
function containsJsDoc(value) {
    return !lodash_1.isNil(value) && value.includes('@');
}
function parse(content, tags) {
    var ast;
    try {
        ast = doctrine_1.default.parse(content, {
            tags: tags,
            sloppy: true,
        });
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        throw new Error('Cannot parse JSDoc tags.');
    }
    return ast;
}
var DEFAULT_OPTIONS = {
    tags: ['param', 'arg', 'argument', 'returns', 'ignore'],
};
exports.parseJsDoc = function (value, options) {
    if (options === void 0) { options = DEFAULT_OPTIONS; }
    if (!containsJsDoc(value)) {
        return {
            includesJsDoc: false,
            ignore: false,
        };
    }
    var jsDocAst = parse(value, options.tags);
    var extractedTags = extractJsDocTags(jsDocAst);
    if (extractedTags.ignore) {
        // There is no point in doing other stuff since this prop will not be rendered.
        return {
            includesJsDoc: true,
            ignore: true,
        };
    }
    return {
        includesJsDoc: true,
        ignore: false,
        // Always use the parsed description to ensure JSDoc is removed from the description.
        description: jsDocAst.description,
        extractedTags: extractedTags,
    };
};
function extractJsDocTags(ast) {
    var extractedTags = {
        params: null,
        returns: null,
        ignore: false,
    };
    for (var i = 0; i < ast.tags.length; i += 1) {
        var tag = ast.tags[i];
        if (tag.title === 'ignore') {
            extractedTags.ignore = true;
            // Once we reach an @ignore tag, there is no point in parsing the other tags since we will not render the prop.
            break;
        }
        else {
            switch (tag.title) {
                // arg & argument are aliases for param.
                case 'param':
                case 'arg':
                case 'argument': {
                    var paramTag = extractParam(tag);
                    if (!lodash_1.isNil(paramTag)) {
                        if (lodash_1.isNil(extractedTags.params)) {
                            extractedTags.params = [];
                        }
                        extractedTags.params.push(paramTag);
                    }
                    break;
                }
                case 'returns': {
                    var returnsTag = extractReturns(tag);
                    if (!lodash_1.isNil(returnsTag)) {
                        extractedTags.returns = returnsTag;
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }
    return extractedTags;
}
function extractParam(tag) {
    var paramName = tag.name;
    // When the @param doesn't have a name but have a type and a description, "null-null" is returned.
    if (!lodash_1.isNil(paramName) && paramName !== 'null-null') {
        return {
            name: tag.name,
            type: tag.type,
            description: tag.description,
            getPrettyName: function () {
                if (paramName.includes('null')) {
                    // There is a few cases in which the returned param name contains "null".
                    // - @param {SyntheticEvent} event- Original SyntheticEvent
                    // - @param {SyntheticEvent} event.\n@returns {string}
                    return paramName.replace('-null', '').replace('.null', '');
                }
                return tag.name;
            },
            getTypeName: function () {
                return !lodash_1.isNil(tag.type) ? extractTypeName(tag.type) : null;
            },
        };
    }
    return null;
}
function extractReturns(tag) {
    if (!lodash_1.isNil(tag.type)) {
        return {
            type: tag.type,
            description: tag.description,
            getTypeName: function () {
                return extractTypeName(tag.type);
            },
        };
    }
    return null;
}
function extractTypeName(type) {
    if (type.type === 'NameExpression') {
        return type.name;
    }
    if (type.type === 'RecordType') {
        var recordFields = type.fields.map(function (field) {
            if (!lodash_1.isNil(field.value)) {
                var valueTypeName = extractTypeName(field.value);
                return field.key + ": " + valueTypeName;
            }
            return field.key;
        });
        return "({" + recordFields.join(', ') + "})";
    }
    if (type.type === 'UnionType') {
        var unionElements = type.elements.map(extractTypeName);
        return "(" + unionElements.join('|') + ")";
    }
    // Only support untyped array: []. Might add more support later if required.
    if (type.type === 'ArrayType') {
        return '[]';
    }
    if (type.type === 'TypeApplication') {
        if (!lodash_1.isNil(type.expression)) {
            if (type.expression.name === 'Array') {
                var arrayType = extractTypeName(type.applications[0]);
                return arrayType + "[]";
            }
        }
    }
    if (type.type === 'NullableType' ||
        type.type === 'NonNullableType' ||
        type.type === 'OptionalType') {
        return extractTypeName(type.expression);
    }
    if (type.type === 'AllLiteral') {
        return 'any';
    }
    return null;
}
