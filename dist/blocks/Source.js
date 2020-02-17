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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var components_1 = require("@storybook/components");
var DocsContext_1 = require("./DocsContext");
var shared_1 = require("./shared");
var extract = function (targetId, _a) {
    var source = _a.source, locationsMap = _a.locationsMap;
    var location = locationsMap[targetId];
    // FIXME: bad locationsMap generated for module export functions whose titles are overridden
    if (!location)
        return null;
    var start = location.startBody, end = location.endBody;
    var lines = source.split('\n');
    if (start.line === end.line) {
        return lines[start.line - 1].substring(start.col, end.col);
    }
    // NOTE: storysource locations are 1-based not 0-based!
    var startLine = lines[start.line - 1];
    var endLine = lines[end.line - 1];
    return __spreadArrays([
        startLine.substring(start.col)
    ], lines.slice(start.line, end.line - 1), [
        endLine.substring(0, end.col),
    ]).join('\n');
};
exports.getSourceProps = function (props, _a) {
    var currentId = _a.id, storyStore = _a.storyStore;
    var codeProps = props;
    var singleProps = props;
    var multiProps = props;
    var source = codeProps.code; // prefer user-specified code
    if (!source) {
        var targetId = singleProps.id === shared_1.CURRENT_SELECTION ? currentId : singleProps.id;
        var targetIds = multiProps.ids || [targetId];
        source = targetIds
            .map(function (sourceId) {
            var data = storyStore.fromId(sourceId);
            if (data && data.parameters) {
                var _a = data.parameters, mdxSource = _a.mdxSource, storySource = _a.storySource;
                return mdxSource || (storySource && extract(sourceId, storySource));
            }
            return '';
        })
            .join('\n\n');
    }
    return source
        ? { code: source, language: props.language || 'jsx', dark: props.dark || false }
        : { error: components_1.SourceError.SOURCE_UNAVAILABLE };
};
/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
var SourceContainer = function (props) { return (react_1.default.createElement(DocsContext_1.DocsContext.Consumer, null, function (context) {
    var sourceProps = exports.getSourceProps(props, context);
    return react_1.default.createElement(components_1.Source, __assign({}, sourceProps));
})); };
exports.Source = SourceContainer;
