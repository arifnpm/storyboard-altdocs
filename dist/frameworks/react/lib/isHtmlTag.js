"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var html_tags_1 = __importDefault(require("html-tags"));
function isHtmlTag(tagName) {
    return html_tags_1.default.includes(tagName.toLowerCase());
}
exports.isHtmlTag = isHtmlTag;
