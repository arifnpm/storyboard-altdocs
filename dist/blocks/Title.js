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
var csf_1 = require("@storybook/csf");
var components_1 = require("@storybook/components");
var DocsContext_1 = require("./DocsContext");
exports.defaultTitleSlot = function (_a) {
    var selectedKind = _a.selectedKind, parameters = _a.parameters;
    var _b = (parameters && parameters.options) || {}, showRoots = _b.showRoots, _c = _b.hierarchyRootSeparator, rootSeparator = _c === void 0 ? '|' : _c, _d = _b.hierarchySeparator, groupSeparator = _d === void 0 ? /\/|\./ : _d;
    var groups;
    if (typeof showRoots !== 'undefined') {
        groups = selectedKind.split('/');
    }
    else {
        // This covers off all the remaining cases:
        //   - If the separators were set above, we should use them
        //   - If they weren't set, we should only should use the old defaults if the kind contains '.' or '|',
        //     which for this particular splitting is the only case in which it actually matters.
        (groups = csf_1.parseKind(selectedKind, { rootSeparator: rootSeparator, groupSeparator: groupSeparator }).groups);
    }
    return (groups && groups[groups.length - 1]) || selectedKind;
};
exports.Title = function (_a) {
    var slot = _a.slot, children = _a.children;
    var context = react_1.useContext(DocsContext_1.DocsContext);
    var selectedKind = context.selectedKind, parameters = context.parameters;
    var text = children;
    if (!text) {
        if (slot) {
            text = slot(context);
        }
        else {
            text = exports.defaultTitleSlot({ selectedKind: selectedKind, parameters: parameters });
        }
    }
    return text ? react_1.default.createElement(components_1.Title, { className: "sbdocs-title" }, text) : null;
};
