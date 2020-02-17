"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Subheading_1 = require("./Subheading");
var Anchor_1 = require("./Anchor");
var Description_1 = require("./Description");
var Story_1 = require("./Story");
var Preview_1 = require("./Preview");
exports.DocsStory = function (_a) {
    var id = _a.id, name = _a.name, _b = _a.expanded, expanded = _b === void 0 ? true : _b, _c = _a.withToolbar, withToolbar = _c === void 0 ? false : _c, parameters = _a.parameters;
    return (react_1.default.createElement(Anchor_1.Anchor, { storyId: id },
        expanded && react_1.default.createElement(Subheading_1.Subheading, null, name),
        expanded && parameters && parameters.docs && parameters.docs.storyDescription && (react_1.default.createElement(Description_1.Description, { markdown: parameters.docs.storyDescription })),
        react_1.default.createElement(Preview_1.Preview, { withToolbar: withToolbar },
            react_1.default.createElement(Story_1.Story, { id: id }))));
};
