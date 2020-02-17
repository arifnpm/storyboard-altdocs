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
var react_2 = require("@mdx-js/react");
var html_1 = require("@storybook/components/html");
var components_1 = require("@storybook/components");
var csf_1 = require("@storybook/csf");
var shared_1 = require("./shared");
var DocsContext_1 = require("./DocsContext");
exports.storyBlockIdFromId = function (storyId) { return "story--" + storyId; };
var resetComponents = {};
Object.keys(html_1.components).forEach(function (key) {
    resetComponents[key] = function (props) { return react_1.createElement(key, props); };
});
var inferInlineStories = function (framework) {
    switch (framework) {
        case 'react':
            return true;
        default:
            return false;
    }
};
exports.getStoryProps = function (props, _a) {
    var currentId = _a.id, storyStore = _a.storyStore, mdxStoryNameToKey = _a.mdxStoryNameToKey, mdxComponentMeta = _a.mdxComponentMeta;
    var id = props.id;
    var name = props.name;
    var inputId = id === shared_1.CURRENT_SELECTION ? currentId : id;
    var previewId = inputId ||
        csf_1.toId(mdxComponentMeta.id || mdxComponentMeta.title, csf_1.storyNameFromExport(mdxStoryNameToKey[name]));
    var height = props.height, inline = props.inline;
    var data = storyStore.fromId(previewId);
    var _b = ((data && data.parameters) || {}).framework, framework = _b === void 0 ? null : _b;
    var docsParam = (data && data.parameters && data.parameters.docs) || {};
    if (docsParam.disable) {
        return null;
    }
    // prefer props, then global options, then framework-inferred values
    var _c = docsParam.inlineStories, inlineStories = _c === void 0 ? inferInlineStories(framework) : _c, _d = docsParam.iframeHeight, iframeHeight = _d === void 0 ? undefined : _d, _e = docsParam.prepareForInline, prepareForInline = _e === void 0 ? undefined : _e;
    var _f = data || {}, _g = _f.storyFn, storyFn = _g === void 0 ? undefined : _g, _h = _f.name, storyName = _h === void 0 ? undefined : _h;
    var storyIsInline = typeof inline === 'boolean' ? inline : inlineStories;
    if (storyIsInline && !prepareForInline && framework !== 'react') {
        throw new Error("Story '" + storyName + "' is set to render inline, but no 'prepareForInline' function is implemented in your docs configuration!");
    }
    return {
        inline: storyIsInline,
        id: previewId,
        storyFn: prepareForInline && storyFn ? function () { return prepareForInline(storyFn); } : storyFn,
        height: height || (storyIsInline ? undefined : iframeHeight),
        title: storyName,
    };
};
var StoryContainer = function (props) { return (react_1.default.createElement(DocsContext_1.DocsContext.Consumer, null, function (context) {
    var storyProps = exports.getStoryProps(props, context);
    if (!storyProps) {
        return null;
    }
    return (react_1.default.createElement("div", { id: exports.storyBlockIdFromId(storyProps.id) },
        react_1.default.createElement(react_2.MDXProvider, { components: resetComponents },
            react_1.default.createElement(components_1.Story, __assign({}, storyProps)))));
})); };
exports.Story = StoryContainer;
StoryContainer.defaultProps = {
    children: null,
    name: null,
};
