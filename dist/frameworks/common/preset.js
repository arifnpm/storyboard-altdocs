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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var mdx_compiler_plugin_1 = __importDefault(require("storyboard-altdocs/mdx-compiler-plugin"));
var remark_slug_1 = __importDefault(require("remark-slug"));
var remark_external_links_1 = __importDefault(require("remark-external-links"));
function createBabelOptions(babelOptions, configureJSX) {
    if (!configureJSX) {
        return babelOptions;
    }
    var babelPlugins = (babelOptions && babelOptions.plugins) || [];
    return __assign(__assign({}, babelOptions), { 
        // for frameworks that are not working with react, we need to configure
        // the jsx to transpile mdx, for now there will be a flag for that
        // for more complex solutions we can find alone that we need to add '@babel/plugin-transform-react-jsx'
        plugins: __spreadArrays(babelPlugins, ['@babel/plugin-transform-react-jsx']) });
}
function webpack(webpackConfig, options) {
    if (webpackConfig === void 0) { webpackConfig = {}; }
    if (options === void 0) { options = {}; }
    var _a = webpackConfig.module, module = _a === void 0 ? {} : _a;
    // it will reuse babel options that are already in use in storybook
    // also, these babel options are chained with other presets.
    var babelOptions = options.babelOptions, _b = options.configureJSX, configureJSX = _b === void 0 ? options.framework !== 'react' : _b, // if not user-specified
    _c = options.sourceLoaderOptions, // if not user-specified
    sourceLoaderOptions = _c === void 0 ? {} : _c;
    var mdxLoaderOptions = {
        remarkPlugins: [remark_slug_1.default, remark_external_links_1.default],
    };
    // set `sourceLoaderOptions` to `null` to disable for manual configuration
    var sourceLoader = sourceLoaderOptions
        ? [
            {
                test: /\.(stories|story)\.[tj]sx?$/,
                loader: require.resolve('@storybook/source-loader'),
                options: __assign(__assign({}, sourceLoaderOptions), { inspectLocalDependencies: true }),
                enforce: 'pre',
            },
        ]
        : [];
    var result = __assign(__assign({}, webpackConfig), { module: __assign(__assign({}, module), { rules: __spreadArrays((module.rules || []), [
                {
                    test: /\.js$/,
                    include: /node_modules\/acorn-jsx/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [[require.resolve('@babel/preset-env'), { modules: 'commonjs' }]],
                            },
                        },
                    ],
                },
                {
                    test: /\.(stories|story).mdx$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: createBabelOptions(babelOptions, configureJSX),
                        },
                        {
                            loader: '@mdx-js/loader',
                            options: __assign({ compilers: [mdx_compiler_plugin_1.default(options)] }, mdxLoaderOptions),
                        },
                    ],
                },
                {
                    test: /\.mdx$/,
                    exclude: /\.(stories|story).mdx$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: createBabelOptions(babelOptions, configureJSX),
                        },
                        {
                            loader: '@mdx-js/loader',
                            options: mdxLoaderOptions,
                        },
                    ],
                }
            ], sourceLoader) }) });
    return result;
}
exports.webpack = webpack;
function managerEntries(entry, options) {
    if (entry === void 0) { entry = []; }
    return __spreadArrays(entry, [require.resolve('../../register')]);
}
exports.managerEntries = managerEntries;
function config(entry, options) {
    if (entry === void 0) { entry = []; }
    if (options === void 0) { options = {}; }
    var framework = options.framework;
    var docsConfig = [require.resolve('./config')];
    try {
        docsConfig.push(require.resolve("../" + framework + "/config"));
    }
    catch (err) {
        // there is no custom config for the user's framework, do nothing
    }
    return __spreadArrays(docsConfig, entry);
}
exports.config = config;
