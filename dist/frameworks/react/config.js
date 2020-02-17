"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var client_api_1 = require("@storybook/client-api");
var extractProps_1 = require("./extractProps");
var docgen_1 = require("../../lib/docgen");
client_api_1.addParameters({
    docs: {
        // react is Storybook's "native" framework, so it's stories are inherently prepared to be rendered inline
        // NOTE: that the result is a react element. Hooks support is provided by the outer code.
        prepareForInline: function (storyFn) { return storyFn(); },
        extractProps: extractProps_1.extractProps,
        extractComponentDescription: docgen_1.extractComponentDescription,
    },
});
