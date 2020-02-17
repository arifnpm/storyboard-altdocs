"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function webpack(webpackConfig, options) {
    if (webpackConfig === void 0) { webpackConfig = {}; }
    if (options === void 0) { options = {}; }
    webpackConfig.module.rules.push({
        test: /\.vue$/,
        loader: 'vue-docgen-loader',
        enforce: 'post',
    });
    return webpackConfig;
}
exports.webpack = webpack;
