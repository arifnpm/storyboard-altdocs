"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global window */
/* eslint-disable import/no-extraneous-dependencies */
var client_api_1 = require("@storybook/client-api");
var web_components_1 = require("@storybook/web-components");
var react_1 = __importDefault(require("react"));
var lit_html_1 = require("lit-html");
function mapData(data) {
    return data.map(function (item) { return ({
        name: item.name,
        type: { summary: item.type },
        required: '',
        description: item.description,
        defaultValue: { summary: item.default !== undefined ? item.default : item.defaultValue },
    }); });
}
function isEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}
client_api_1.addParameters({
    docs: {
        extractProps: function (tagName) {
            var customElements = web_components_1.getCustomElements();
            if (web_components_1.isValidComponent(tagName) && web_components_1.isValidMetaData(customElements)) {
                var metaData = customElements.tags.find(function (tag) { return tag.name.toUpperCase() === tagName.toUpperCase(); });
                var sections = {};
                if (metaData.attributes) {
                    sections.attributes = mapData(metaData.attributes);
                }
                if (metaData.properties) {
                    sections.properties = mapData(metaData.properties);
                }
                if (metaData.events) {
                    sections.events = mapData(metaData.events);
                }
                if (metaData.slots) {
                    sections.slots = mapData(metaData.slots);
                }
                if (metaData.cssProperties) {
                    sections.css = mapData(metaData.cssProperties);
                }
                return isEmpty(sections) ? false : { sections: sections };
            }
            return false;
        },
        extractComponentDescription: function (tagName) {
            var customElements = web_components_1.getCustomElements();
            if (web_components_1.isValidComponent(tagName) && web_components_1.isValidMetaData(customElements)) {
                var metaData = customElements.tags.find(function (tag) { return tag.name.toUpperCase() === tagName.toUpperCase(); });
                if (metaData && metaData.description) {
                    return metaData.description;
                }
            }
            return false;
        },
        inlineStories: true,
        prepareForInline: function (storyFn) {
            var Story = /** @class */ (function (_super) {
                __extends(Story, _super);
                function Story(props) {
                    var _this = _super.call(this, props) || this;
                    _this.wrapperRef = react_1.default.createRef();
                    return _this;
                }
                Story.prototype.componentDidMount = function () {
                    lit_html_1.render(storyFn(), this.wrapperRef.current);
                };
                Story.prototype.render = function () {
                    return react_1.default.createElement('div', { ref: this.wrapperRef });
                };
                return Story;
            }(react_1.default.Component));
            return react_1.default.createElement(Story);
        },
    },
});
