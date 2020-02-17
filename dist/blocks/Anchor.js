"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
exports.anchorBlockIdFromId = function (storyId) { return "anchor--" + storyId; };
exports.Anchor = function (_a) {
    var storyId = _a.storyId, children = _a.children;
    return (react_1.default.createElement("div", { id: exports.anchorBlockIdFromId(storyId) }, children));
};
