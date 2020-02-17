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
var lodash_1 = require("lodash");
var components_1 = require("@storybook/components");
var DocsContext_1 = require("./DocsContext");
var shared_1 = require("./shared");
var utils_1 = require("./utils");
var extractProps_1 = require("../frameworks/react/extractProps");
var extractProps_2 = require("../frameworks/vue/extractProps");
// FIXME: remove in SB6.0 & require config
var inferPropsExtractor = function (framework) {
    switch (framework) {
        case 'react':
            return extractProps_1.extractProps;
        case 'vue':
            return extractProps_2.extractProps;
        default:
            return null;
    }
};
var filterRows = function (rows, exclude) {
    return rows && rows.filter(function (row) { return !exclude.includes(row.name); });
};
exports.getComponentProps = function (component, _a, _b) {
    var exclude = _a.exclude;
    var parameters = _b.parameters;
    if (!component) {
        return null;
    }
    try {
        var params = parameters || {};
        var _c = params.framework, framework = _c === void 0 ? null : _c;
        var _d = (params.docs || {}).extractProps, extractProps = _d === void 0 ? inferPropsExtractor(framework) : _d;
        if (!extractProps) {
            throw new Error(components_1.PropsTableError.PROPS_UNSUPPORTED);
        }
        var props = extractProps(component);
        if (!lodash_1.isNil(exclude)) {
            var rows = props.rows;
            var sections_1 = props.sections;
            if (rows) {
                props = { rows: filterRows(rows, exclude) };
            }
            else if (sections_1) {
                Object.keys(sections_1).forEach(function (section) {
                    sections_1[section] = filterRows(sections_1[section], exclude);
                });
            }
        }
        return props;
    }
    catch (err) {
        return { error: err.message };
    }
};
exports.getComponent = function (props, context) {
    if (props === void 0) { props = {}; }
    var of = props.of;
    var _a = context.parameters, parameters = _a === void 0 ? {} : _a;
    var component = parameters.component;
    var target = of === shared_1.CURRENT_SELECTION ? component : of;
    if (!target) {
        if (of === shared_1.CURRENT_SELECTION) {
            return null;
        }
        throw new Error(components_1.PropsTableError.NO_COMPONENT);
    }
    return target;
};
var PropsContainer = function (props) {
    var _a;
    var context = react_1.useContext(DocsContext_1.DocsContext);
    var slot = props.slot, components = props.components;
    var subcomponents = context.parameters.subcomponents;
    var allComponents = components;
    if (!allComponents) {
        var main = exports.getComponent(props, context);
        var mainLabel = utils_1.getComponentName(main);
        var mainProps = slot ? slot(context, main) : exports.getComponentProps(main, props, context);
        if (!subcomponents || typeof subcomponents !== 'object') {
            return mainProps && react_1.default.createElement(components_1.PropsTable, __assign({}, mainProps));
        }
        allComponents = __assign((_a = {}, _a[mainLabel] = main, _a), subcomponents);
    }
    var tabs = [];
    Object.entries(allComponents).forEach(function (_a) {
        var label = _a[0], component = _a[1];
        tabs.push({
            label: label,
            table: slot ? slot(context, component) : exports.getComponentProps(component, props, context),
        });
    });
    return (react_1.default.createElement(components_1.TabsState, null, tabs.map(function (_a) {
        var label = _a.label, table = _a.table;
        if (!table) {
            return null;
        }
        var id = "prop_table_div_" + label;
        return (react_1.default.createElement("div", { key: id, id: id, title: label }, function (_a) {
            var active = _a.active;
            return active ? react_1.default.createElement(components_1.PropsTable, __assign({ key: "prop_table_" + label }, table)) : null;
        }));
    })));
};
exports.Props = PropsContainer;
PropsContainer.defaultProps = {
    of: '.',
};
