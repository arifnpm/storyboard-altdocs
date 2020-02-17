"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var react_1 = __importDefault(require("react"));
var vue_to_react_1 = __importDefault(require("@egoist/vue-to-react"));
var client_api_1 = require("@storybook/client-api");
var extractProps_1 = require("./extractProps");
var docgen_1 = require("../../lib/docgen");
client_api_1.addParameters({
    docs: {
        prepareForInline: function (storyFn) {
            var Story = vue_to_react_1.default(storyFn());
            return react_1.default.createElement(Story, null);
        },
        extractProps: extractProps_1.extractProps,
        extractComponentDescription: docgen_1.extractComponentDescription,
    },
});
