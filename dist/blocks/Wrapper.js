"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
exports.Wrapper = function (_a) {
    var children = _a.children;
    return (react_1.default.createElement("div", { style: { fontFamily: 'sans-serif' } }, children));
};
