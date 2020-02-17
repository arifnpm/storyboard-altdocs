"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var html_1 = require("@storybook/components/html");
var mdx_1 = require("./mdx");
exports.Heading = function (_a) {
    var children = _a.children, disableAnchor = _a.disableAnchor;
    if (disableAnchor || typeof children !== 'string') {
        return react_1.default.createElement(html_1.H2, null, children);
    }
    var tagID = children.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    return (react_1.default.createElement(mdx_1.HeaderMdx, { as: "h2", id: tagID }, children));
};
