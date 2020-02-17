"use strict";
/* eslint-disable no-underscore-dangle */
/* global window */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMethod = function (methodOrProp) {
    return methodOrProp.args !== undefined;
};
exports.setCompodocJson = function (compodocJson) {
    // @ts-ignore
    window.__STORYBOOK_COMPODOC_JSON__ = compodocJson;
};
// @ts-ignore
exports.getCompdocJson = function () { return window.__STORYBOOK_COMPODOC_JSON__; };
exports.checkValidComponentOrDirective = function (component) {
    if (!component.name) {
        throw new Error("Invalid component " + JSON.stringify(component));
    }
};
exports.checkValidCompodocJson = function (compodocJson) {
    if (!compodocJson || !compodocJson.components) {
        throw new Error('Invalid compodoc JSON');
    }
};
function isEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}
var hasDecorator = function (item, decoratorName) {
    return item.decorators && item.decorators.find(function (x) { return x.name === decoratorName; });
};
var mapPropertyToSection = function (key, item) {
    if (hasDecorator(item, 'ViewChild')) {
        return 'view child';
    }
    if (hasDecorator(item, 'ViewChildren')) {
        return 'view children';
    }
    if (hasDecorator(item, 'ContentChild')) {
        return 'content child';
    }
    if (hasDecorator(item, 'ContentChildren')) {
        return 'content children';
    }
    return 'properties';
};
var mapItemToSection = function (key, item) {
    switch (key) {
        case 'methodsClass':
            return 'methods';
        case 'inputsClass':
            return 'inputs';
        case 'outputsClass':
            return 'outputs';
        case 'propertiesClass':
            if (exports.isMethod(item)) {
                throw new Error("Cannot be of type Method if key === 'propertiesClass'");
            }
            return mapPropertyToSection(key, item);
        default:
            throw new Error("Unknown key: " + key);
    }
};
var getComponentData = function (component) {
    if (!component) {
        return null;
    }
    exports.checkValidComponentOrDirective(component);
    var compodocJson = exports.getCompdocJson();
    exports.checkValidCompodocJson(compodocJson);
    var name = component.name;
    return (compodocJson.components.find(function (c) { return c.name === name; }) ||
        compodocJson.directives.find(function (c) { return c.name === name; }));
};
var displaySignature = function (item) {
    var args = item.args.map(function (arg) { return "" + arg.name + (arg.optional ? '?' : '') + ": " + arg.type; });
    return "(" + args.join(', ') + ") => " + item.returnType;
};
exports.extractProps = function (component) {
    var componentData = getComponentData(component);
    if (!componentData) {
        return null;
    }
    var sectionToItems = {};
    var compodocClasses = ['propertiesClass', 'methodsClass', 'inputsClass', 'outputsClass'];
    compodocClasses.forEach(function (key) {
        var data = componentData[key] || [];
        data.forEach(function (item) {
            var sectionItem = {
                name: item.name,
                type: { summary: exports.isMethod(item) ? displaySignature(item) : item.type },
                required: exports.isMethod(item) ? false : !item.optional,
                description: item.description,
                defaultValue: { summary: exports.isMethod(item) ? '' : item.defaultValue },
            };
            var section = mapItemToSection(key, item);
            if (!sectionToItems[section]) {
                sectionToItems[section] = [];
            }
            sectionToItems[section].push(sectionItem);
        });
    });
    // sort the sections
    var SECTIONS = [
        'inputs',
        'outputs',
        'properties',
        'methods',
        'view child',
        'view children',
        'content child',
        'content children',
    ];
    var sections = {};
    SECTIONS.forEach(function (section) {
        var items = sectionToItems[section];
        if (items) {
            sections[section] = items;
        }
    });
    return isEmpty(sections) ? null : { sections: sections };
};
exports.extractComponentDescription = function (component) {
    var componentData = getComponentData(component);
    if (!componentData) {
        return null;
    }
    return componentData.rawdescription;
};
