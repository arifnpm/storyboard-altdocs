"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var client_api_1 = require("@storybook/client-api");
var compodoc_1 = require("./compodoc");
client_api_1.addParameters({
    docs: {
        extractProps: compodoc_1.extractProps,
        extractComponentDescription: compodoc_1.extractComponentDescription,
    },
});
