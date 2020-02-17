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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var csf_1 = require("@storybook/csf");
var components_1 = require("@storybook/components");
var Source_1 = require("./Source");
var DocsContext_1 = require("./DocsContext");
var SourceState;
(function (SourceState) {
    SourceState["OPEN"] = "open";
    SourceState["CLOSED"] = "closed";
    SourceState["NONE"] = "none";
})(SourceState = exports.SourceState || (exports.SourceState = {}));
var getPreviewProps = function (_a, _b) {
    var mdxStoryNameToKey = _b.mdxStoryNameToKey, mdxComponentMeta = _b.mdxComponentMeta, storyStore = _b.storyStore;
    var _c = _a.withSource, withSource = _c === void 0 ? SourceState.CLOSED : _c, mdxSource = _a.mdxSource, children = _a.children, props = __rest(_a, ["withSource", "mdxSource", "children"]);
    if (withSource === SourceState.NONE) {
        return props;
    }
    if (mdxSource) {
        return __assign(__assign({}, props), { withSource: Source_1.getSourceProps({ code: decodeURI(mdxSource) }, { storyStore: storyStore }) });
    }
    var childArray = Array.isArray(children) ? children : [children];
    var stories = childArray.filter(function (c) { return c.props && (c.props.id || c.props.name); });
    var targetIds = stories.map(function (s) {
        return s.props.id ||
            csf_1.toId(mdxComponentMeta.id || mdxComponentMeta.title, csf_1.storyNameFromExport(mdxStoryNameToKey[s.props.name]));
    });
    var sourceProps = Source_1.getSourceProps({ ids: targetIds }, { storyStore: storyStore });
    return __assign(__assign({}, props), { withSource: sourceProps, isExpanded: withSource === SourceState.OPEN });
};
exports.Preview = function (props) { return (react_1.default.createElement(DocsContext_1.DocsContext.Consumer, null, function (context) {
    var previewProps = getPreviewProps(props, context);
    return react_1.default.createElement(components_1.Preview, __assign({}, previewProps), props.children);
})); };
