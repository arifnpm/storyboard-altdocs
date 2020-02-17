"use strict";
/* eslint-disable no-underscore-dangle */
/* global window */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJSONDoc = function (jsondoc) {
    window.__EMBER_GENERATED_DOC_JSON__ = jsondoc;
};
exports.getJSONDoc = function () {
    return window.__EMBER_GENERATED_DOC_JSON__;
};
exports.extractProps = function (componentName) {
    var json = exports.getJSONDoc();
    var componentDoc = json.included.find(function (doc) { return doc.attributes.name === componentName; });
    var rows = componentDoc.attributes.arguments.map(function (prop) {
        return {
            name: prop.name,
            type: prop.type,
            required: prop.tags.length ? prop.tags.some(function (tag) { return tag.name === 'required'; }) : false,
            defaultValue: prop.defaultValue,
            description: prop.description,
        };
    });
    return { rows: rows };
};
exports.extractComponentDescription = function (componentName) {
    var json = exports.getJSONDoc();
    var componentDoc = json.included.find(function (doc) { return doc.attributes.name === componentName; });
    return componentDoc.attributes.description;
};
