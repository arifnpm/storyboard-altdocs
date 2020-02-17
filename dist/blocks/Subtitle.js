"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var components_1 = require("@storybook/components");
var DocsContext_1 = require("./DocsContext");
exports.Subtitle = function (_a) {
    var slot = _a.slot, children = _a.children;
    var context = react_1.useContext(DocsContext_1.DocsContext);
    var parameters = context.parameters;
    var text = children;
    if (!text) {
        text = slot ? slot(context) : parameters && parameters.componentSubtitle;
    }
    return text ? react_1.default.createElement(components_1.Subtitle, { className: "sbdocs-subtitle" }, text) : null;
};
