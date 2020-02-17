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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var global_1 = require("global");
var react_2 = require("@mdx-js/react");
var theming_1 = require("@storybook/theming");
var components_1 = require("@storybook/components");
var html_1 = require("@storybook/components/html");
var DocsContext_1 = require("./DocsContext");
var Anchor_1 = require("./Anchor");
var Story_1 = require("./Story");
var mdx_1 = require("./mdx");
var utils_1 = require("./utils");
var defaultComponents = __assign(__assign(__assign({}, html_1.components), { code: mdx_1.CodeOrSourceMdx, a: mdx_1.AnchorMdx }), mdx_1.HeadersMdx);
exports.DocsContainer = function (_a) {
    var context = _a.context, children = _a.children;
    var _b = context || {}, _c = _b.id, storyId = _c === void 0 ? null : _c, _d = _b.parameters, parameters = _d === void 0 ? {} : _d;
    var options = parameters.options || {};
    var theme = theming_1.ensure(options.theme);
    var _e = (parameters.docs || {}).components, userComponents = _e === void 0 ? null : _e;
    var allComponents = __assign(__assign({}, defaultComponents), userComponents);
    react_1.useEffect(function () {
        var url;
        try {
            url = new URL(global_1.window.parent.location);
        }
        catch (err) {
            return;
        }
        if (url.hash) {
            var element_1 = global_1.document.getElementById(url.hash.substring(1));
            if (element_1) {
                // Introducing a delay to ensure scrolling works when it's a full refresh.
                setTimeout(function () {
                    utils_1.scrollToElement(element_1);
                }, 200);
            }
        }
        else {
            var element_2 = global_1.document.getElementById(Anchor_1.anchorBlockIdFromId(storyId)) ||
                global_1.document.getElementById(Story_1.storyBlockIdFromId(storyId));
            if (element_2) {
                var allStories = element_2.parentElement.querySelectorAll('[id|="anchor-"]');
                var block_1 = 'start';
                if (allStories && allStories[0] === element_2) {
                    block_1 = 'end'; // first story should be shown with the intro content above
                }
                // Introducing a delay to ensure scrolling works when it's a full refresh.
                setTimeout(function () {
                    utils_1.scrollToElement(element_2, block_1);
                }, 200);
            }
        }
    }, [storyId]);
    return (react_1.default.createElement(DocsContext_1.DocsContext.Provider, { value: context },
        react_1.default.createElement(theming_1.ThemeProvider, { theme: theme },
            react_1.default.createElement(react_2.MDXProvider, { components: allComponents },
                react_1.default.createElement(components_1.DocsWrapper, { className: "sbdocs sbdocs-wrapper" },
                    react_1.default.createElement(components_1.DocsContent, { className: "sbdocs sbdocs-content" }, children))))));
};
