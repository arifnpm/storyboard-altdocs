"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var client_api_1 = require("@storybook/client-api");
var blocks_1 = require("../../../blocks");
client_api_1.addParameters({
    docs: {
        container: blocks_1.DocsContainer,
        page: blocks_1.DocsPage,
    },
});
