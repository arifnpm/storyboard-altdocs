"use strict";
/* eslint-disable no-underscore-dangle */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = __importDefault(require("prop-types"));
var react_1 = __importDefault(require("react"));
var docgen_1 = require("../../../lib/docgen");
var handleProp_1 = require("./handleProp");
var DOCGEN_SECTION = 'props';
function ReactComponent() {
    return react_1.default.createElement("div", null, "React Component!");
}
function createDocgenSection(docgenInfo) {
    var _a;
    return _a = {},
        _a[DOCGEN_SECTION] = __assign({}, docgenInfo),
        _a;
}
function createDocgenProp(_a) {
    var _b;
    var name = _a.name, type = _a.type, others = __rest(_a, ["name", "type"]);
    return _b = {},
        _b[name] = __assign({ type: type, required: false }, others),
        _b;
}
// eslint-disable-next-line react/forbid-foreign-prop-types
function createComponent(_a) {
    var _b = _a.propTypes, propTypes = _b === void 0 ? {} : _b, _c = _a.defaultProps, defaultProps = _c === void 0 ? {} : _c, _d = _a.docgenInfo, docgenInfo = _d === void 0 ? {} : _d;
    var component = function () {
        return react_1.default.createElement("div", null, "Hey!");
    };
    component.propTypes = propTypes;
    component.defaultProps = defaultProps;
    // @ts-ignore
    component.__docgenInfo = createDocgenSection(docgenInfo);
    return component;
}
function createDefaultValue(defaultValue) {
    return { value: defaultValue };
}
function extractPropDef(component, rawDefaultProp) {
    return handleProp_1.enhancePropTypesProp(docgen_1.extractComponentProps(component, DOCGEN_SECTION)[0], rawDefaultProp);
}
describe('enhancePropTypesProp', function () {
    describe('type', function () {
        function createTestComponent(docgenInfo) {
            return createComponent({
                docgenInfo: __assign({}, createDocgenProp(__assign({ name: 'prop' }, docgenInfo))),
            });
        }
        describe('custom', function () {
            describe('when raw value is available', function () {
                it('should support literal', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: 'MY_LITERAL',
                        },
                    });
                    var type = extractPropDef(component).type;
                    expect(type.summary).toBe('MY_LITERAL');
                    expect(type.detail).toBeUndefined();
                });
                it('should support short object', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: '{\n  text: PropTypes.string.isRequired,\n}',
                        },
                    });
                    var type = extractPropDef(component).type;
                    var expectedSummary = '{ text: string }';
                    expect(type.summary.replace(/\s/g, '')).toBe(expectedSummary.replace(/\s/g, ''));
                    expect(type.detail).toBeUndefined();
                });
                it('should support long object', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: '{\n  text: PropTypes.string.isRequired,\n  value1: PropTypes.string.isRequired,\n  value2: PropTypes.string.isRequired,\n  value3: PropTypes.string.isRequired,\n  value4: PropTypes.string.isRequired,\n}',
                        },
                    });
                    var type = extractPropDef(component).type;
                    expect(type.summary).toBe('object');
                    var expectedDetail = "{\n            text: string,\n            value1: string,\n            value2: string,\n            value3: string,\n            value4: string\n          }";
                    expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
                });
                it('should not have a deep object as summary', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: '{\n  foo: { bar: PropTypes.string.isRequired,\n  }}',
                        },
                    });
                    var type = extractPropDef(component).type;
                    expect(type.summary).toBe('object');
                });
                it('should use identifier of a React element when available', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: 'function InlinedFunctionalComponent() {\n  return <div>Inlined FunctionnalComponent!</div>;\n}',
                        },
                    });
                    var type = extractPropDef(component).type;
                    expect(type.summary).toBe('InlinedFunctionalComponent');
                    var expectedDetail = "function InlinedFunctionalComponent() {\n            return <div>Inlined FunctionnalComponent!</div>;\n          }";
                    expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
                });
                it('should not use identifier of a HTML element', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: '<div>Hello world from Montreal, Quebec, Canada!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>',
                        },
                    });
                    var type = extractPropDef(component).type;
                    expect(type.summary).toBe('element');
                    var expectedDetail = '<div>Hello world from Montreal, Quebec, Canada!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>';
                    expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
                });
                it('should support element without identifier', function () {
                    var component = createTestComponent({
                        type: {
                            name: 'custom',
                            raw: '() => {\n  return <div>Inlined FunctionalComponent!</div>;\n}',
                        },
                    });
                    var type = extractPropDef(component).type;
                    expect(type.summary).toBe('element');
                    var expectedDetail = "() => {\n              return <div>Inlined FunctionalComponent!</div>;\n            }";
                    expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
                });
                describe('when it is not a known type', function () {
                    it('should return "custom" when its a long type', function () {
                        var component = createTestComponent({
                            type: {
                                name: 'custom',
                                raw: 'Symbol("A very very very very very very lonnnngggggggggggggggggggggggggggggggggggg symbol")',
                            },
                        });
                        var type = extractPropDef(component).type;
                        expect(type.summary).toBe('custom');
                        expect(type.detail).toBe('Symbol("A very very very very very very lonnnngggggggggggggggggggggggggggggggggggg symbol")');
                    });
                    it('should return "custom" when its a short type', function () {
                        var component = createTestComponent({
                            type: {
                                name: 'custom',
                                raw: 'Symbol("Hey!")',
                            },
                        });
                        var type = extractPropDef(component).type;
                        expect(type.summary).toBe('Symbol("Hey!")');
                        expect(type.detail).toBeUndefined();
                    });
                });
            });
            it("should return 'custom' when there is no raw value", function () {
                var component = createTestComponent({
                    type: {
                        name: 'custom',
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('custom');
            });
        });
        [
            'any',
            'bool',
            'string',
            'number',
            'symbol',
            'object',
            'element',
            'elementType',
            'node',
        ].forEach(function (x) {
            it("should return '" + x + "' when type is " + x, function () {
                var component = createTestComponent({
                    type: {
                        name: x,
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe(x);
            });
        });
        it('should support short shape', function () {
            var component = createTestComponent({
                type: {
                    name: 'shape',
                    value: {
                        foo: {
                            name: 'string',
                            required: false,
                        },
                    },
                },
            });
            var type = extractPropDef(component).type;
            var expectedSummary = '{ foo: string }';
            expect(type.summary.replace(/\s/g, '')).toBe(expectedSummary.replace(/\s/g, ''));
            expect(type.detail).toBeUndefined();
        });
        it('should support long shape', function () {
            var component = createTestComponent({
                type: {
                    name: 'shape',
                    value: {
                        foo: {
                            name: 'string',
                            required: false,
                        },
                        bar: {
                            name: 'string',
                            required: false,
                        },
                        another: {
                            name: 'string',
                            required: false,
                        },
                        another2: {
                            name: 'string',
                            required: false,
                        },
                        another3: {
                            name: 'string',
                            required: false,
                        },
                        another4: {
                            name: 'string',
                            required: false,
                        },
                    },
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('object');
            var expectedDetail = "{\n        foo: string,\n        bar: string,\n        another: string,\n        another2: string,\n        another3: string,\n        another4: string\n      }";
            expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should not have a deep shape as summary', function () {
            var component = createTestComponent({
                type: {
                    name: 'shape',
                    value: {
                        bar: {
                            name: 'shape',
                            value: {
                                hey: {
                                    name: 'string',
                                    required: false,
                                },
                            },
                            required: false,
                        },
                    },
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('object');
        });
        it('should support enum of string', function () {
            var component = createTestComponent({
                type: {
                    name: 'enum',
                    value: [
                        {
                            value: "'News'",
                            computed: false,
                        },
                        {
                            value: "'Photos'",
                            computed: false,
                        },
                    ],
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe("'News' | 'Photos'");
        });
        it('should support enum of object', function () {
            var component = createTestComponent({
                type: {
                    name: 'enum',
                    value: [
                        {
                            value: '{\n  text: PropTypes.string.isRequired,\n  value: PropTypes.string.isRequired,\n}',
                            computed: true,
                        },
                        {
                            value: '{\n  foo: PropTypes.string,\n  bar: PropTypes.string,\n  hey: PropTypes.string,\n  ho: PropTypes.string,\n}',
                            computed: true,
                        },
                    ],
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('object | object');
            var expectedDetail = "{\n          text: string,\n          value: string\n        } | {\n          foo: string,\n          bar: string,\n          hey: string,\n          ho: string\n        }";
            expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should support short object in enum summary', function () {
            var component = createTestComponent({
                type: {
                    name: 'enum',
                    value: [
                        {
                            value: '{\n  text: PropTypes.string.isRequired,\n}',
                            computed: true,
                        },
                        {
                            value: '{\n  foo: PropTypes.string,\n}',
                            computed: true,
                        },
                    ],
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('{ text: string } | { foo: string }');
        });
        it('should not have a deep object in an enum summary', function () {
            var component = createTestComponent({
                type: {
                    name: 'enum',
                    value: [
                        {
                            value: '{\n  text: { foo: PropTypes.string.isRequired,\n }\n}',
                            computed: true,
                        },
                        {
                            value: '{\n  foo: PropTypes.string,\n}',
                            computed: true,
                        },
                    ],
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('object | object');
        });
        it('should support enum of element', function () {
            var component = createTestComponent({
                type: {
                    name: 'enum',
                    value: [
                        {
                            value: '() => {\n  return <div>FunctionnalComponent!</div>;\n}',
                            computed: true,
                        },
                        {
                            value: 'class ClassComponent extends React.PureComponent {\n  render() {\n    return <div>ClassComponent!</div>;\n  }\n}',
                            computed: true,
                        },
                    ],
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('element | ClassComponent');
            var expectedDetail = "() => {\n          return <div>FunctionnalComponent!</div>;\n        } | class ClassComponent extends React.PureComponent {\n          render() {\n            return <div>ClassComponent!</div>;\n          }\n        }";
            expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        describe('func', function () {
            it('should return "func" when the prop dont have a description', function () {
                var component = createTestComponent({
                    type: {
                        name: 'func',
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('func');
            });
            it('should return "func" when the prop have a description without JSDoc tags', function () {
                var component = createTestComponent({
                    type: {
                        name: 'func',
                    },
                    description: 'Hey! Hey!',
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('func');
            });
            it('should return a func signature when there is JSDoc tags.', function () {
                var component = createTestComponent({
                    type: {
                        name: 'func',
                    },
                    description: '@param event\n@param data\n@returns {string}',
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('(event, data) => string');
            });
        });
        it('should return the instance type when type is instanceOf', function () {
            var component = createTestComponent({
                type: {
                    name: 'instanceOf',
                    value: 'Set',
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('Set');
        });
        describe('objectOf', function () {
            it('should support objectOf primitive', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'number',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf(number)');
                expect(type.detail).toBeUndefined();
            });
            it('should support objectOf of identifier', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'custom',
                            raw: 'NAMED_OBJECT',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf(NAMED_OBJECT)');
                expect(type.detail).toBeUndefined();
            });
            it('should support objectOf short object', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'custom',
                            raw: '{\n  foo: PropTypes.string,\n}',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf({ foo: string })');
                expect(type.detail).toBeUndefined();
            });
            it('should support objectOf long object', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'custom',
                            raw: '{\n  foo: PropTypes.string,\n  bar: PropTypes.string,\n  another: PropTypes.string,\n  anotherAnother: PropTypes.string,\n}',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf(object)');
                var expectedDetail = "objectOf({\n          foo: string,\n          bar: string,\n          another: string,\n          anotherAnother: string\n        })";
                expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            it('should not have deep object in summary', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'custom',
                            raw: '{\n  foo: { bar: PropTypes.string,\n }\n}',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf(object)');
            });
            it('should support objectOf short shape', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'shape',
                            value: {
                                foo: {
                                    name: 'string',
                                    required: false,
                                },
                            },
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf({ foo: string })');
                expect(type.detail).toBeUndefined();
            });
            it('should support objectOf long shape', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'shape',
                            value: {
                                foo: {
                                    name: 'string',
                                    required: false,
                                },
                                bar: {
                                    name: 'string',
                                    required: false,
                                },
                                another: {
                                    name: 'string',
                                    required: false,
                                },
                                anotherAnother: {
                                    name: 'string',
                                    required: false,
                                },
                            },
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf(object)');
                var expectedDetail = "objectOf({\n          foo: string,\n          bar: string,\n          another: string,\n          anotherAnother: string\n        })";
                expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            it('should not have a deep shape in summary', function () {
                var component = createTestComponent({
                    type: {
                        name: 'objectOf',
                        value: {
                            name: 'shape',
                            value: {
                                bar: {
                                    name: 'shape',
                                    value: {
                                        hey: {
                                            name: 'string',
                                            required: false,
                                        },
                                    },
                                    required: false,
                                },
                            },
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('objectOf(object)');
            });
        });
        it('should support union', function () {
            var component = createTestComponent({
                type: {
                    name: 'union',
                    value: [
                        {
                            name: 'string',
                        },
                        {
                            name: 'instanceOf',
                            value: 'Set',
                        },
                    ],
                },
            });
            var type = extractPropDef(component).type;
            expect(type.summary).toBe('string | Set');
            expect(type.detail).toBeUndefined();
        });
        describe('array', function () {
            it('should support array of primitive', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'number',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('number[]');
                expect(type.detail).toBeUndefined();
            });
            it('should support array of identifier', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'custom',
                            raw: 'NAMED_OBJECT',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('NAMED_OBJECT[]');
                expect(type.detail).toBeUndefined();
            });
            it('should support array of short object', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'custom',
                            raw: '{\n  foo: PropTypes.string,\n}',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('[{ foo: string }]');
                expect(type.detail).toBeUndefined();
            });
            it('should support array of long object', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'custom',
                            raw: '{\n  text: PropTypes.string.isRequired,\n  value: PropTypes.string.isRequired,\n  another: PropTypes.string.isRequired,\n  another2: PropTypes.string.isRequired,\n  another3: PropTypes.string.isRequired,\n  another4: PropTypes.string.isRequired,\n}',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('object[]');
                var expectedDetail = "[{\n          text: string,\n          value: string,\n          another: string,\n          another2: string,\n          another3: string,\n          another4: string\n        }]";
                expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            it('should not have deep object in summary', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'custom',
                            raw: '{\n  foo: { bar: PropTypes.string, }\n}',
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('object[]');
            });
            it('should support array of short shape', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'shape',
                            value: {
                                foo: {
                                    name: 'string',
                                    required: false,
                                },
                            },
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('[{ foo: string }]');
                expect(type.detail).toBeUndefined();
            });
            it('should support array of long shape', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'shape',
                            value: {
                                foo: {
                                    name: 'string',
                                    required: false,
                                },
                                bar: {
                                    name: 'string',
                                    required: false,
                                },
                                another: {
                                    name: 'string',
                                    required: false,
                                },
                                another2: {
                                    name: 'string',
                                    required: false,
                                },
                                another3: {
                                    name: 'string',
                                    required: false,
                                },
                                another4: {
                                    name: 'string',
                                    required: false,
                                },
                            },
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('object[]');
                var expectedDetail = "[{\n          foo: string,\n          bar: string,\n          another: string,\n          another2: string,\n          another3: string,\n          another4: string\n        }]";
                expect(type.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            it('should not have deep shape in summary', function () {
                var component = createTestComponent({
                    type: {
                        name: 'arrayOf',
                        value: {
                            name: 'shape',
                            value: {
                                bar: {
                                    name: 'shape',
                                    value: {
                                        hey: {
                                            name: 'string',
                                            required: false,
                                        },
                                    },
                                    required: false,
                                },
                            },
                        },
                    },
                });
                var type = extractPropDef(component).type;
                expect(type.summary).toBe('object[]');
            });
        });
    });
    describe('defaultValue', function () {
        function createTestComponent(defaultValue, typeName) {
            if (typeName === void 0) { typeName = 'anything-is-fine'; }
            return createComponent({
                docgenInfo: __assign({}, createDocgenProp({
                    name: 'prop',
                    type: { name: typeName },
                    defaultValue: defaultValue,
                })),
            });
        }
        it('should support short object', function () {
            var component = createTestComponent(createDefaultValue("{ foo: 'foo', bar: 'bar' }"));
            var defaultValue = extractPropDef(component).defaultValue;
            var expectedSummary = "{ foo: 'foo', bar: 'bar' }";
            expect(defaultValue.summary.replace(/\s/g, '')).toBe(expectedSummary.replace(/\s/g, ''));
            expect(defaultValue.detail).toBeUndefined();
        });
        it('should support long object', function () {
            var component = createTestComponent(createDefaultValue("{ foo: 'foo', bar: 'bar', another: 'another' }"));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('object');
            var expectedDetail = "{\n        foo: 'foo',\n        bar: 'bar',\n        another: 'another'\n      }";
            expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should not have deep object in summary', function () {
            var component = createTestComponent(createDefaultValue("{ foo: 'foo', bar: { hey: 'ho' } }"));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('object');
        });
        it('should support short function', function () {
            var component = createTestComponent(createDefaultValue('() => {}'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('() => {}');
            expect(defaultValue.detail).toBeUndefined();
        });
        it('should support long function', function () {
            var component = createTestComponent(createDefaultValue('(foo, bar) => {\n  const concat = foo + bar;\n  const append = concat + " hey!";\n  \n  return append;\n}'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('func');
            var expectedDetail = "(foo, bar) => {\n        const concat = foo + bar;\n        const append = concat + ' hey!';\n        return append\n      }";
            expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should use the name of function when available and indicate that args are present', function () {
            var component = createTestComponent(createDefaultValue('function concat(a, b) {\n  return a + b;\n}'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('concat( ... )');
            var expectedDetail = "function concat(a, b) {\n        return a + b\n      }";
            expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should use the name of function when available', function () {
            var component = createTestComponent(createDefaultValue('function hello() {\n  return "hello";\n}'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('hello()');
            var expectedDetail = "function hello() {\n        return 'hello'\n      }";
            expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should support short element', function () {
            var component = createTestComponent(createDefaultValue('<div>Hey!</div>'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('<div>Hey!</div>');
            expect(defaultValue.detail).toBeUndefined();
        });
        it('should support long element', function () {
            var component = createTestComponent(createDefaultValue('<div>Hey! Hey! Hey!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('element');
            expect(defaultValue.detail).toBe('<div>Hey! Hey! Hey!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>');
        });
        it('should support element with props', function () {
            var component = createTestComponent(createDefaultValue('<Component className="toto" />'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('<Component />');
            expect(defaultValue.detail).toBe('<Component className="toto" />');
        });
        it("should use the name of the React component when it's available", function () {
            var component = createTestComponent(createDefaultValue('function InlinedFunctionalComponent() {\n  return <div>Inlined FunctionnalComponent!</div>;\n}'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('<InlinedFunctionalComponent />');
            var expectedDetail = "function InlinedFunctionalComponent() {\n        return <div>Inlined FunctionnalComponent!</div>;\n      }";
            expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should not use the name of an HTML element', function () {
            var component = createTestComponent(createDefaultValue('<div>Hey!</div>'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).not.toBe('<div />');
        });
        it('should support short array', function () {
            var component = createTestComponent(createDefaultValue('[1]'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('[1]');
            expect(defaultValue.detail).toBeUndefined();
        });
        it('should support long array', function () {
            var component = createTestComponent(createDefaultValue('[\n  {\n    thing: {\n      id: 2,\n      func: () => {},\n      arr: [],\n    },\n  },\n]'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('array');
            var expectedDetail = "[{\n          thing: {\n            id: 2,\n            func: () => {\n            },\n            arr: []\n          }\n        }]";
            expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
        });
        it('should not have deep array in summary', function () {
            var component = createTestComponent(createDefaultValue('[[[1]]]'));
            var defaultValue = extractPropDef(component).defaultValue;
            expect(defaultValue.summary).toBe('array');
        });
        describe('fromRawDefaultProp', function () {
            [
                { type: 'string', defaultProp: 'foo' },
                { type: 'number', defaultProp: 1 },
                { type: 'boolean', defaultProp: true },
                { type: 'symbol', defaultProp: Symbol('hey!') },
            ].forEach(function (x) {
                it("should support " + x.type, function () {
                    var component = createTestComponent(null);
                    var defaultValue = extractPropDef(component, x.defaultProp).defaultValue;
                    expect(defaultValue.summary).toBe(x.defaultProp.toString());
                    expect(defaultValue.detail).toBeUndefined();
                });
            });
            it('should support array of primitives', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, [1, 2, 3]).defaultValue;
                expect(defaultValue.summary).toBe('[1,    2,    3]');
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support array of short object', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, [{ foo: 'bar' }]).defaultValue;
                expect(defaultValue.summary).toBe("[{ 'foo': 'bar' }]");
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support array of long object', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, [{ foo: 'bar', bar: 'foo', hey: 'ho' }]).defaultValue;
                expect(defaultValue.summary).toBe('array');
                var expectedDetail = "[{\n          'foo': 'bar',\n          'bar': 'foo',\n          'hey': 'ho'\n        }]";
                expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            it('should support short object', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, { foo: 'bar' }).defaultValue;
                expect(defaultValue.summary).toBe("{ 'foo': 'bar' }");
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support long object', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, { foo: 'bar', bar: 'foo', hey: 'ho' }).defaultValue;
                expect(defaultValue.summary).toBe('object');
                var expectedDetail = "{\n          'foo': 'bar',\n          'bar': 'foo',\n          'hey': 'ho'\n        }";
                expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            it('should support anonymous function', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, function () { return 'hey!'; }).defaultValue;
                expect(defaultValue.summary).toBe('func');
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support named function', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, function hello() {
                    return 'world!';
                }).defaultValue;
                expect(defaultValue.summary).toBe('hello()');
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support named function with params', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, function add(a, b) {
                    return a + b;
                }).defaultValue;
                expect(defaultValue.summary).toBe('add( ... )');
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support React element', function () {
                var component = createTestComponent(null);
                var defaultProp = react_1.default.createElement(ReactComponent, null);
                // Simulate babel-plugin-add-react-displayname.
                defaultProp.type.displayName = 'ReactComponent';
                var defaultValue = extractPropDef(component, defaultProp).defaultValue;
                expect(defaultValue.summary).toBe('<ReactComponent />');
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support React element with props', function () {
                var component = createTestComponent(null);
                // @ts-ignore
                var defaultProp = react_1.default.createElement(ReactComponent, { className: "toto" });
                // Simulate babel-plugin-add-react-displayname.
                defaultProp.type.displayName = 'ReactComponent';
                var defaultValue = extractPropDef(component, defaultProp).defaultValue;
                expect(defaultValue.summary).toBe('<ReactComponent />');
                expect(defaultValue.detail).toBe('<ReactComponent className="toto" />');
            });
            it('should support short HTML element', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, react_1.default.createElement("div", null, "HTML element")).defaultValue;
                expect(defaultValue.summary).toBe('<div>HTML element</div>');
                expect(defaultValue.detail).toBeUndefined();
            });
            it('should support long HTML element', function () {
                var component = createTestComponent(null);
                var defaultValue = extractPropDef(component, react_1.default.createElement("div", null, "HTML element!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")).defaultValue;
                expect(defaultValue.summary).toBe('element');
                var expectedDetail = "<div>\n          HTML element!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n        </div>";
                expect(defaultValue.detail.replace(/\s/g, '')).toBe(expectedDetail.replace(/\s/g, ''));
            });
            ['element', 'elementType'].forEach(function (x) {
                it("should support inlined React class component for " + x, function () {
                    var component = createTestComponent(null, x);
                    var defaultValue = extractPropDef(component, /** @class */ (function (_super) {
                        __extends(InlinedClassComponent, _super);
                        function InlinedClassComponent() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        InlinedClassComponent.prototype.render = function () {
                            return react_1.default.createElement("div", null, "Inlined ClassComponent!");
                        };
                        return InlinedClassComponent;
                    }(react_1.default.PureComponent))).defaultValue;
                    expect(defaultValue.summary).toBe('<InlinedClassComponent />');
                    expect(defaultValue.detail).toBeUndefined();
                });
                it("should support inlined anonymous React functional component for " + x, function () {
                    var component = createTestComponent(null, x);
                    var defaultValue = extractPropDef(component, function () {
                        return react_1.default.createElement("div", null, "Inlined FunctionnalComponent!");
                    }).defaultValue;
                    expect(defaultValue.summary).toBe('element');
                    expect(defaultValue.detail).toBeUndefined();
                });
                it("should support inlined anonymous React functional component with props for " + x, function () {
                    var component = createTestComponent(null, x);
                    var defaultValue = extractPropDef(component, function (_a) {
                        var foo = _a.foo;
                        return react_1.default.createElement("div", null, foo);
                    }).defaultValue;
                    expect(defaultValue.summary).toBe('element');
                    expect(defaultValue.detail).toBeUndefined();
                });
                it("should support inlined named React functional component for " + x, function () {
                    var component = createTestComponent(null, x);
                    var defaultValue = extractPropDef(component, function InlinedFunctionalComponent() {
                        return react_1.default.createElement("div", null, "Inlined FunctionnalComponent!");
                    }).defaultValue;
                    expect(defaultValue.summary).toBe('<InlinedFunctionalComponent />');
                    expect(defaultValue.detail).toBeUndefined();
                });
                it("should support inlined named React functional component with props for " + x, function () {
                    var component = createTestComponent(null, x);
                    var defaultValue = extractPropDef(component, function InlinedFunctionalComponent(_a) {
                        var foo = _a.foo;
                        return react_1.default.createElement("div", null, foo);
                    }).defaultValue;
                    expect(defaultValue.summary).toBe('<InlinedFunctionalComponent />');
                    expect(defaultValue.detail).toBeUndefined();
                });
            });
        });
    });
});
describe('enhancePropTypesProps', function () {
    it('should keep the original definition order', function () {
        var component = createComponent({
            propTypes: {
                foo: prop_types_1.default.string,
                middleWithDefaultValue: prop_types_1.default.string,
                bar: prop_types_1.default.string,
                endWithDefaultValue: prop_types_1.default.string,
            },
            docgenInfo: __assign(__assign(__assign(__assign({}, createDocgenProp({
                name: 'middleWithDefaultValue',
                type: { name: 'string' },
                defaultValue: { value: 'Middle!' },
            })), createDocgenProp({
                name: 'endWithDefaultValue',
                type: { name: 'string' },
                defaultValue: { value: 'End!' },
            })), createDocgenProp({
                name: 'foo',
                type: { name: 'string' },
            })), createDocgenProp({
                name: 'bar',
                type: { name: 'string' },
            })),
        });
        var props = handleProp_1.enhancePropTypesProps(docgen_1.extractComponentProps(component, DOCGEN_SECTION), component);
        expect(props.length).toBe(4);
        expect(props[0].name).toBe('foo');
        expect(props[1].name).toBe('middleWithDefaultValue');
        expect(props[2].name).toBe('bar');
        expect(props[3].name).toBe('endWithDefaultValue');
    });
    it('should not include @ignore props', function () {
        var component = createComponent({
            propTypes: {
                foo: prop_types_1.default.string,
                bar: prop_types_1.default.string,
            },
            docgenInfo: __assign(__assign({}, createDocgenProp({
                name: 'foo',
                type: { name: 'string' },
            })), createDocgenProp({
                name: 'bar',
                type: { name: 'string' },
                description: '@ignore',
            })),
        });
        var props = handleProp_1.enhancePropTypesProps(docgen_1.extractComponentProps(component, DOCGEN_SECTION), component);
        expect(props.length).toBe(1);
        expect(props[0].name).toBe('foo');
    });
});
