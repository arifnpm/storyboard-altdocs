"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocsStories = function (context) {
    var storyStore = context.storyStore, selectedKind = context.selectedKind;
    if (!storyStore) {
        return [];
    }
    return storyStore
        .getStoriesForKind(selectedKind)
        .filter(function (s) { return !(s.parameters && s.parameters.docs && s.parameters.docs.disable); });
};
var titleCase = function (str) {
    return str
        .split('-')
        .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
        .join('');
};
exports.getComponentName = function (component) {
    if (!component) {
        return undefined;
    }
    if (typeof component === 'string') {
        if (component.includes('-')) {
            return titleCase(component);
        }
        return component;
    }
    if (component.__docgenInfo && component.__docgenInfo.displayName) {
        return component.__docgenInfo.displayName;
    }
    return component.name;
};
function scrollToElement(element, block) {
    if (block === void 0) { block = 'start'; }
    element.scrollIntoView({
        behavior: 'smooth',
        block: block,
        inline: 'nearest',
    });
}
exports.scrollToElement = scrollToElement;
