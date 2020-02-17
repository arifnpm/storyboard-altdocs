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
var addons_1 = __importDefault(require("@storybook/addons"));
var components_1 = require("@storybook/components");
var core_events_1 = require("@storybook/core-events");
var html_1 = require("@storybook/components/html");
var global_1 = require("global");
var theming_1 = require("@storybook/theming");
var DocsContext_1 = require("./DocsContext");
// Hacky utility for asserting identifiers in MDX Story elements
exports.assertIsFn = function (val) {
    if (typeof val !== 'function') {
        throw new Error("Expected story function, got: " + val);
    }
    return val;
};
// Hacky utilty for adding mdxStoryToId to the default context
exports.AddContext = function (props) {
    var children = props.children, rest = __rest(props, ["children"]);
    var parentContext = react_1.default.useContext(DocsContext_1.DocsContext);
    return (react_1.default.createElement(DocsContext_1.DocsContext.Provider, { value: __assign(__assign({}, parentContext), rest) }, children));
};
exports.CodeOrSourceMdx = function (_a) {
    var className = _a.className, children = _a.children, rest = __rest(_a, ["className", "children"]);
    // markdown-to-jsx does not add className to inline code
    if (typeof className !== 'string' &&
        (typeof children !== 'string' || !children.match(/[\n\r]/g))) {
        return react_1.default.createElement(html_1.Code, null, children);
    }
    // className: "lang-jsx"
    var language = className && className.split('-');
    return (react_1.default.createElement(components_1.Source, __assign({ language: (language && language[1]) || 'plaintext', format: false, code: children }, rest)));
};
function navigate(url) {
    addons_1.default.getChannel().emit(core_events_1.NAVIGATE_URL, url);
}
// @ts-ignore
var A = html_1.components.a;
var AnchorInPage = function (_a) {
    var hash = _a.hash, children = _a.children;
    return (react_1.default.createElement(A, { href: hash, target: "_self", onClick: function (event) {
            var id = hash.substring(1);
            var element = global_1.document.getElementById(id);
            if (element) {
                navigate(hash);
            }
        } }, children));
};
exports.AnchorMdx = function (props) {
    var href = props.href, target = props.target, children = props.children, rest = __rest(props, ["href", "target", "children"]);
    if (href) {
        // Enable scrolling for in-page anchors.
        if (href.startsWith('#')) {
            return react_1.default.createElement(AnchorInPage, { hash: href }, children);
        }
        // Links to other pages of SB should use the base URL of the top level iframe instead of the base URL of the preview iframe.
        if (target !== '_blank') {
            return (react_1.default.createElement(A, __assign({ href: href, onClick: function (event) {
                    event.preventDefault();
                    navigate(href);
                }, target: target }, rest), children));
        }
    }
    // External URL dont need any modification.
    return react_1.default.createElement(A, __assign({}, props));
};
var SUPPORTED_MDX_HEADERS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var OcticonHeaders = SUPPORTED_MDX_HEADERS.reduce(function (acc, headerType) {
    var _a;
    return (__assign(__assign({}, acc), (_a = {}, _a[headerType] = theming_1.styled(html_1.components[headerType])({
        '& svg': {
            visibility: 'hidden',
        },
        '&:hover svg': {
            visibility: 'visible',
        },
    }), _a)));
}, {});
var OcticonAnchor = theming_1.styled.a(function () { return ({
    float: 'left',
    paddingRight: '4px',
    marginLeft: '-20px',
}); });
var HeaderWithOcticonAnchor = function (_a) {
    var as = _a.as, id = _a.id, children = _a.children, rest = __rest(_a, ["as", "id", "children"]);
    // @ts-ignore
    var OcticonHeader = OcticonHeaders[as];
    var hash = "#" + id;
    return (react_1.default.createElement(OcticonHeader, __assign({ id: id }, rest),
        react_1.default.createElement(OcticonAnchor, { "aria-hidden": "true", href: hash, tabIndex: -1, target: "_self", onClick: function (event) {
                var element = global_1.document.getElementById(id);
                if (element) {
                    navigate(hash);
                }
            } },
            react_1.default.createElement("svg", { viewBox: "0 0 16 16", version: "1.1", width: "16", height: "16", "aria-hidden": "true" },
                react_1.default.createElement("path", { fillRule: "evenodd", d: "M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z" }))),
        children));
};
exports.HeaderMdx = function (props) {
    var as = props.as, id = props.id, children = props.children, rest = __rest(props, ["as", "id", "children"]);
    // An id should have been added on every header by the "remark-slug" plugin.
    if (id) {
        return (react_1.default.createElement(HeaderWithOcticonAnchor, __assign({ as: as, id: id }, rest), children));
    }
    // @ts-ignore
    var Header = html_1.components[as];
    // Make sure it still work if "remark-slug" plugin is not present.
    return react_1.default.createElement(Header, __assign({}, props));
};
exports.HeadersMdx = SUPPORTED_MDX_HEADERS.reduce(function (acc, headerType) {
    var _a;
    return (__assign(__assign({}, acc), (_a = {}, _a[headerType] = function (props) { return react_1.default.createElement(exports.HeaderMdx, __assign({ as: headerType }, props)); }, _a)));
}, {});
