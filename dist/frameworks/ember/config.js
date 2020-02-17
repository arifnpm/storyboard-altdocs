"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var client_api_1 = require("@storybook/client-api");
var jsondoc_1 = require("./jsondoc");
client_api_1.addParameters({
    docs: {
        iframeHeight: 80,
        extractProps: jsondoc_1.extractProps,
        extractComponentDescription: jsondoc_1.extractComponentDescription,
    },
});
