"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commonPreset = __importStar(require("./frameworks/common/preset"));
var PRESET_METHODS = [
    'babel',
    'babelDefault',
    'managerBabel',
    'webpack',
    'webpackFinal',
    'managerWebpack',
    'managerEntries',
    'entries',
    'config',
];
function getFrameworkPreset(frameworkPresetFile) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(frameworkPresetFile);
}
// Create a composite preset that applies the base preset &
// appends any framework-specific extensions as needed
function withFrameworkExtensions(basePreset, mapper) {
    var extended = {};
    PRESET_METHODS.forEach(function (method) {
        extended[method] = function (existing, options) {
            var updated = existing;
            var baseMethod = basePreset[method];
            if (baseMethod) {
                updated = baseMethod(updated, options);
            }
            var frameworkPresetFile = mapper(options.framework);
            if (frameworkPresetFile) {
                var frameworkPreset = getFrameworkPreset(frameworkPresetFile);
                var frameworkMethod = frameworkPreset[method];
                if (frameworkMethod)
                    updated = frameworkMethod(updated, options);
            }
            return updated;
        };
    });
    return extended;
}
module.exports = withFrameworkExtensions(commonPreset, function (framework) {
    try {
        return require.resolve("./frameworks/" + framework + "/preset");
    }
    catch (err) {
        // there is no custom config for the user's framework, do nothing
        return null;
    }
});
