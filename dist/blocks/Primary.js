"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var DocsContext_1 = require("./DocsContext");
var DocsStory_1 = require("./DocsStory");
var utils_1 = require("./utils");
exports.Primary = function (_a) {
    var slot = _a.slot;
    var context = react_1.useContext(DocsContext_1.DocsContext);
    var componentStories = utils_1.getDocsStories(context);
    var story = slot ? slot(componentStories, context) : componentStories && componentStories[0];
    return story ? react_1.default.createElement(DocsStory_1.DocsStory, __assign({}, story, { expanded: false, withToolbar: true })) : null;
};
