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
    var name = _a.name, tsType = _a.tsType, others = __rest(_a, ["name", "tsType"]);
    return _b = {},
        _b[name] = __assign({ tsType: tsType, required: false }, others),
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
    return handleProp_1.enhanceTypeScriptProp(docgen_1.extractComponentProps(component, DOCGEN_SECTION)[0], rawDefaultProp);
}
describe('enhanceTypeScriptProp', function () {
    describe('defaultValue', function () {
        function createTestComponent(defaultValue, typeName) {
            if (typeName === void 0) { typeName = 'anything-is-fine'; }
            return createComponent({
                docgenInfo: __assign({}, createDocgenProp({
                    name: 'prop',
                    tsType: { name: typeName },
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
