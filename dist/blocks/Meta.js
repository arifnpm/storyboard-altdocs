"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var global_1 = require("global");
var Anchor_1 = require("./Anchor");
var DocsContext_1 = require("./DocsContext");
var utils_1 = require("./utils");
function getFirstStoryId(docsContext) {
    var stories = utils_1.getDocsStories(docsContext);
    return stories.length > 0 ? stories[0].id : null;
}
function renderAnchor() {
    var context = react_1.useContext(DocsContext_1.DocsContext);
    // eslint-disable-next-line react/destructuring-assignment
    var anchorId = getFirstStoryId(context) || context.id;
    return react_1.default.createElement(Anchor_1.Anchor, { storyId: anchorId });
}
/**
 * This component is used to declare component metadata in docs
 * and gets transformed into a default export underneath the hood.
 */
exports.Meta = function () {
    var params = new URL(global_1.document.location).searchParams;
    var isDocs = params.get('viewMode') === 'docs';
    return isDocs ? renderAnchor() : null;
};
