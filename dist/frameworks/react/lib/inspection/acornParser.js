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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var acorn_1 = require("acorn");
// @ts-ignore
var acorn_jsx_1 = __importDefault(require("acorn-jsx"));
var lodash_1 = require("lodash");
// @ts-ignore
var acornWalk = __importStar(require("acorn-walk"));
var types_1 = require("./types");
var ACORN_WALK_VISITORS = __assign(__assign({}, acornWalk.base), { JSXElement: function () { } });
var acornParser = acorn_1.Parser.extend(acorn_jsx_1.default());
// Cannot use "estree.Identifier" type because this function also support "JSXIdentifier".
function extractIdentifierName(identifierNode) {
    return !lodash_1.isNil(identifierNode) ? identifierNode.name : null;
}
function filterAncestors(ancestors) {
    return ancestors.filter(function (x) { return x.type === 'ObjectExpression' || x.type === 'ArrayExpression'; });
}
function calculateNodeDepth(node) {
    var depths = [];
    acornWalk.ancestor(
    //@ts-ignore
    node, {
        ObjectExpression: function (_, ancestors) {
            depths.push(filterAncestors(ancestors).length);
        },
        ArrayExpression: function (_, ancestors) {
            depths.push(filterAncestors(ancestors).length);
        },
    }, ACORN_WALK_VISITORS);
    return Math.max.apply(Math, depths);
}
function parseIdentifier(identifierNode) {
    return {
        inferedType: {
            type: types_1.InspectionType.IDENTIFIER,
            identifier: extractIdentifierName(identifierNode),
        },
        ast: identifierNode,
    };
}
function parseLiteral(literalNode) {
    return {
        inferedType: { type: types_1.InspectionType.LITERAL },
        ast: literalNode,
    };
}
function parseFunction(funcNode) {
    var innerJsxElementNode;
    // If there is at least a JSXElement in the body of the function, then it's a React component.
    acornWalk.simple(
    //@ts-ignore
    funcNode.body, {
        JSXElement: function (node) {
            innerJsxElementNode = node;
        },
    }, ACORN_WALK_VISITORS);
    var isJsx = !lodash_1.isNil(innerJsxElementNode);
    var inferedType = {
        type: isJsx ? types_1.InspectionType.ELEMENT : types_1.InspectionType.FUNCTION,
        params: funcNode.params,
        hasParams: funcNode.params.length !== 0,
    };
    var identifierName = extractIdentifierName(funcNode.id);
    if (!lodash_1.isNil(identifierName)) {
        inferedType.identifier = identifierName;
    }
    return {
        inferedType: inferedType,
        ast: funcNode,
    };
}
function parseClass(classNode) {
    var innerJsxElementNode;
    // If there is at least a JSXElement in the body of the class, then it's a React component.
    acornWalk.simple(
    //@ts-ignore
    classNode.body, {
        JSXElement: function (node) {
            innerJsxElementNode = node;
        },
    }, ACORN_WALK_VISITORS);
    var inferedType = {
        type: !lodash_1.isNil(innerJsxElementNode) ? types_1.InspectionType.ELEMENT : types_1.InspectionType.CLASS,
        identifier: extractIdentifierName(classNode.id),
    };
    return {
        inferedType: inferedType,
        ast: classNode,
    };
}
function parseJsxElement(jsxElementNode) {
    var inferedType = {
        type: types_1.InspectionType.ELEMENT,
    };
    var identifierName = extractIdentifierName(jsxElementNode.openingElement.name);
    if (!lodash_1.isNil(identifierName)) {
        inferedType.identifier = identifierName;
    }
    return {
        inferedType: inferedType,
        ast: jsxElementNode,
    };
}
function parseCall(callNode) {
    var identifierNode = callNode.callee.type === 'MemberExpression' ? callNode.callee.property : callNode.callee;
    var identifierName = extractIdentifierName(identifierNode);
    if (identifierName === 'shape') {
        return parseObject(callNode.arguments[0]);
    }
    return null;
}
function parseObject(objectNode) {
    return {
        inferedType: { type: types_1.InspectionType.OBJECT, depth: calculateNodeDepth(objectNode) },
        ast: objectNode,
    };
}
function parseArray(arrayNode) {
    return {
        inferedType: { type: types_1.InspectionType.ARRAY, depth: calculateNodeDepth(arrayNode) },
        ast: arrayNode,
    };
}
// Cannot set "expression" type to "estree.Expression" because the type doesn't include JSX.
function parseExpression(expression) {
    switch (expression.type) {
        case 'Identifier':
            return parseIdentifier(expression);
        case 'Literal':
            return parseLiteral(expression);
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
            return parseFunction(expression);
        case 'ClassExpression':
            return parseClass(expression);
        case 'JSXElement':
            return parseJsxElement(expression);
        case 'CallExpression':
            return parseCall(expression);
        case 'ObjectExpression':
            return parseObject(expression);
        case 'ArrayExpression':
            return parseArray(expression);
        default:
            return null;
    }
}
function parse(value) {
    var ast = acornParser.parse("(" + value + ")");
    var parsingResult = {
        inferedType: { type: types_1.InspectionType.UNKNOWN },
        ast: ast,
    };
    if (!lodash_1.isNil(ast.body[0])) {
        var rootNode = ast.body[0];
        switch (rootNode.type) {
            case 'ExpressionStatement': {
                var expressionResult = parseExpression(rootNode.expression);
                if (!lodash_1.isNil(expressionResult)) {
                    parsingResult = expressionResult;
                }
                break;
            }
            default:
                break;
        }
    }
    return parsingResult;
}
exports.parse = parse;
