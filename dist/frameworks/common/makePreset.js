"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_deprecate_1 = __importDefault(require("util-deprecate"));
var ts_dedent_1 = __importDefault(require("ts-dedent"));
var common = __importStar(require("../../preset"));
var makePreset = function (framework) {
    util_deprecate_1.default(function () { }, ts_dedent_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    Framework-specific presets are no longer-needed as of Storybook 5.3 and will be removed in 6.0.\n\n    Please use 'storyboard-altdocs/preset' instead of 'storyboard-altdocs/", "/preset'.\n  "], ["\n    Framework-specific presets are no longer-needed as of Storybook 5.3 and will be removed in 6.0.\n\n    Please use 'storyboard-altdocs/preset' instead of 'storyboard-altdocs/", "/preset'.\n  "])), framework))();
    return common;
};
exports.default = makePreset;
var templateObject_1;
