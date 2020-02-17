"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var addons_1 = __importStar(require("@storybook/addons"));
var shared_1 = require("./shared");
addons_1.default.register(shared_1.ADDON_ID, function (api) {
    addons_1.default.add(shared_1.PANEL_ID, {
        type: addons_1.types.TAB,
        title: 'Docs',
        route: function (_a) {
            var storyId = _a.storyId;
            return "/docs/" + storyId;
        },
        match: function (_a) {
            var viewMode = _a.viewMode;
            return viewMode === 'docs';
        },
        render: function () { return null; },
    });
});
