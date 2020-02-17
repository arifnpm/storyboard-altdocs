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
var escodegen_1 = require("escodegen");
var ts_dedent_1 = __importDefault(require("ts-dedent"));
var BASIC_OPTIONS = {
    format: {
        indent: {
            style: '  ',
        },
        semicolons: false,
    },
};
var COMPACT_OPTIONS = __assign(__assign({}, BASIC_OPTIONS), { format: {
        newline: '',
    } });
var PRETTY_OPTIONS = __assign({}, BASIC_OPTIONS);
function generateCode(ast, compact) {
    if (compact === void 0) { compact = false; }
    return escodegen_1.generate(ast, compact ? COMPACT_OPTIONS : PRETTY_OPTIONS);
}
exports.generateCode = generateCode;
function generateObjectCode(ast, compact) {
    if (compact === void 0) { compact = false; }
    return !compact ? generateCode(ast) : generateCompactObjectCode(ast);
}
exports.generateObjectCode = generateObjectCode;
function generateCompactObjectCode(ast) {
    var result = generateCode(ast, true);
    // Cannot get escodegen to add a space before the last } with the compact mode settings.
    // Fix it until a better solution is found.
    if (!result.endsWith(' }')) {
        result = result.slice(0, -1) + " }";
    }
    return result;
}
function generateArrayCode(ast, compact) {
    if (compact === void 0) { compact = false; }
    return !compact ? generateMultilineArrayCode(ast) : generateCompactArrayCode(ast);
}
exports.generateArrayCode = generateArrayCode;
function generateMultilineArrayCode(ast) {
    var result = generateCode(ast);
    // escodegen add extra spacing before the closing bracket of a multile line array with a nested object.
    // Fix it until a better solution is found.
    if (result.endsWith('  }]')) {
        result = ts_dedent_1.default(result);
    }
    return result;
}
function generateCompactArrayCode(ast) {
    var result = generateCode(ast, true);
    // escodegen add extra an extra before the opening bracket of a compact array that contains primitive values.
    // Fix it until a better solution is found.
    if (result.startsWith('[    ')) {
        result = result.replace('[    ', '[');
    }
    return result;
}
