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
var components_1 = require("@storybook/components");
var DocsContext_1 = require("./DocsContext");
var shared_1 = require("./shared");
var docgen_1 = require("../lib/docgen");
var DescriptionType;
(function (DescriptionType) {
    DescriptionType["INFO"] = "info";
    DescriptionType["NOTES"] = "notes";
    DescriptionType["DOCGEN"] = "docgen";
    DescriptionType["LEGACY_5_2"] = "legacy-5.2";
    DescriptionType["AUTO"] = "auto";
})(DescriptionType = exports.DescriptionType || (exports.DescriptionType = {}));
var getNotes = function (notes) {
    return notes && (typeof notes === 'string' ? notes : docgen_1.str(notes.markdown) || docgen_1.str(notes.text));
};
var getInfo = function (info) { return info && (typeof info === 'string' ? info : docgen_1.str(info.text)); };
var noDescription = function (component) { return null; };
exports.getDescriptionProps = function (_a, _b) {
    var of = _a.of, type = _a.type, markdown = _a.markdown, children = _a.children;
    var parameters = _b.parameters;
    if (children || markdown) {
        return { markdown: children || markdown };
    }
    var component = parameters.component, notes = parameters.notes, info = parameters.info, docs = parameters.docs;
    var _c = (docs || {}).extractComponentDescription, extractComponentDescription = _c === void 0 ? noDescription : _c;
    var target = of === shared_1.CURRENT_SELECTION ? component : of;
    switch (type) {
        case DescriptionType.INFO:
            return { markdown: getInfo(info) };
        case DescriptionType.NOTES:
            return { markdown: getNotes(notes) };
        // FIXME: remove in 6.0
        case DescriptionType.LEGACY_5_2:
            return {
                markdown: ("\n" + (getNotes(notes) || getInfo(info) || '') + "\n\n" + (extractComponentDescription(target) || '') + "\n").trim(),
            };
        case DescriptionType.DOCGEN:
        case DescriptionType.AUTO:
        default:
            return { markdown: extractComponentDescription(target, parameters) };
    }
};
var DescriptionContainer = function (props) {
    var context = react_1.useContext(DocsContext_1.DocsContext);
    var slot = props.slot;
    var markdown = exports.getDescriptionProps(props, context).markdown;
    if (slot) {
        markdown = slot(markdown, context);
    }
    return markdown ? react_1.default.createElement(components_1.Description, { markdown: markdown }) : null;
};
exports.Description = DescriptionContainer;
// since we are in the docs blocks, assume default description if for primary component story
DescriptionContainer.defaultProps = {
    of: '.',
};
