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
var mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');
var parser = require('@babel/parser');
var generate = require('@babel/generator').default;
var camelCase = require('lodash/camelCase');
var jsStringEscape = require('js-string-escape');
// Generate the MDX as is, but append named exports for every
// story in the contents
var STORY_REGEX = /^<Story[\s>]/;
var PREVIEW_REGEX = /^<Preview[\s>]/;
var META_REGEX = /^<Meta[\s>]/;
var RESERVED = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;
function getAttr(elt, what) {
    var attr = elt.attributes.find(function (n) { return n.name.name === what; });
    return attr && attr.value;
}
var isReserved = function (name) { return RESERVED.exec(name); };
var startsWithNumber = function (name) { return /^\d/.exec(name); };
var sanitizeName = function (name) {
    var key = camelCase(name);
    if (startsWithNumber(key)) {
        key = "_" + key;
    }
    else if (isReserved(key)) {
        key = key + "Story";
    }
    return key;
};
var getStoryKey = function (name, counter) { return (name ? sanitizeName(name) : "story" + counter); };
function genStoryExport(ast, context) {
    var _a;
    var storyName = getAttr(ast.openingElement, 'name');
    var storyId = getAttr(ast.openingElement, 'id');
    storyName = storyName && storyName.value;
    storyId = storyId && storyId.value;
    if (!storyId && !storyName) {
        throw new Error('Expected a story name or ID attribute');
    }
    // We don't generate exports for story references or the smart "current story"
    if (storyId || !storyName) {
        return null;
    }
    // console.log('genStoryExport', JSON.stringify(ast, null, 2));
    var statements = [];
    var storyKey = getStoryKey(storyName, context.counter);
    var body = ast.children.find(function (n) { return n.type !== 'JSXText'; });
    var storyCode = null;
    if (!body) {
        // plain text node
        var code = generate(ast.children[0], {}).code;
        storyCode = "'" + code + "'";
    }
    else {
        if (body.type === 'JSXExpressionContainer') {
            // FIXME: handle fragments
            body = body.expression;
        }
        var code = generate(body, {}).code;
        storyCode = code;
    }
    var storyVal = null;
    switch (body && body.type) {
        // We don't know what type the identifier is, but this code
        // assumes it's a function from CSF. Let's see who complains!
        case 'Identifier':
            storyVal = "assertIsFn(" + storyCode + ")";
            break;
        case 'ArrowFunctionExpression':
            storyVal = "(" + storyCode + ")";
            break;
        default:
            storyVal = "() => (\n        " + storyCode + "\n      )";
            break;
    }
    statements.push("export const " + storyKey + " = " + storyVal + ";");
    statements.push(storyKey + ".story = {};");
    // always preserve the name, since CSF exports can get modified by displayName
    statements.push(storyKey + ".story.name = '" + storyName + "';");
    var parameters = getAttr(ast.openingElement, 'parameters');
    parameters = parameters && parameters.expression;
    var source = jsStringEscape(storyCode);
    if (parameters) {
        var params = generate(parameters, {}).code;
        // FIXME: hack in the story's source as a parameter
        statements.push(storyKey + ".story.parameters = { mdxSource: '" + source + "', ..." + params + " };");
    }
    else {
        statements.push(storyKey + ".story.parameters = { mdxSource: '" + source + "' };");
    }
    var decorators = getAttr(ast.openingElement, 'decorators');
    decorators = decorators && decorators.expression;
    if (decorators) {
        var decos = generate(decorators, {}).code;
        statements.push(storyKey + ".story.decorators = " + decos + ";");
    }
    // eslint-disable-next-line no-param-reassign
    context.storyNameToKey[storyName] = storyKey;
    return _a = {},
        _a[storyKey] = statements.join('\n'),
        _a;
}
function genPreviewExports(ast, context) {
    // console.log('genPreviewExports', JSON.stringify(ast, null, 2));
    var previewExports = {};
    for (var i = 0; i < ast.children.length; i += 1) {
        var child = ast.children[i];
        if (child.type === 'JSXElement' && child.openingElement.name.name === 'Story') {
            var storyExport = genStoryExport(child, context);
            if (storyExport) {
                Object.assign(previewExports, storyExport);
                // eslint-disable-next-line no-param-reassign
                context.counter += 1;
            }
        }
    }
    return previewExports;
}
function genMeta(ast, options) {
    var title = getAttr(ast.openingElement, 'title');
    var id = getAttr(ast.openingElement, 'id');
    var parameters = getAttr(ast.openingElement, 'parameters');
    var decorators = getAttr(ast.openingElement, 'decorators');
    if (title) {
        if (title.type === 'StringLiteral') {
            title = "'".concat(jsStringEscape(title.value), "'");
        }
        else {
            try {
                // generate code, so the expression is evaluated by the CSF compiler
                var code = generate(title, {}).code;
                // remove the curly brackets at start and end of code
                title = code.replace(/^\{(.+)\}$/, '$1');
            }
            catch (e) {
                // eat exception if title parsing didn't go well
                // eslint-disable-next-line no-console
                console.warn('Invalid title:', options.filepath);
                title = undefined;
            }
        }
    }
    id = id && "'" + id.value + "'";
    if (parameters && parameters.expression) {
        var params = generate(parameters.expression, {}).code;
        parameters = params;
    }
    if (decorators && decorators.expression) {
        var decos = generate(decorators.expression, {}).code;
        decorators = decos;
    }
    return {
        title: title,
        id: id,
        parameters: parameters,
        decorators: decorators,
    };
}
function getExports(node, counter, options) {
    var value = node.value, type = node.type;
    if (type === 'jsx') {
        if (STORY_REGEX.exec(value)) {
            // Single story
            var ast = parser.parseExpression(value, { plugins: ['jsx'] });
            var storyExport = genStoryExport(ast, counter);
            return storyExport && { stories: storyExport };
        }
        if (PREVIEW_REGEX.exec(value)) {
            // Preview, possibly containing multiple stories
            var ast = parser.parseExpression(value, { plugins: ['jsx'] });
            return { stories: genPreviewExports(ast, counter) };
        }
        if (META_REGEX.exec(value)) {
            // Preview, possibly containing multiple stories
            var ast = parser.parseExpression(value, { plugins: ['jsx'] });
            return { meta: genMeta(ast, options) };
        }
    }
    return null;
}
// insert `mdxStoryNameToKey` and `mdxComponentMeta` into the context so that we
// can reconstruct the Story ID dynamically from the `name` at render time
var wrapperJs = "\ncomponentMeta.parameters = componentMeta.parameters || {};\ncomponentMeta.parameters.docs = {\n  ...(componentMeta.parameters.docs || {}),\n  page: () => <AddContext mdxStoryNameToKey={mdxStoryNameToKey} mdxComponentMeta={componentMeta}><MDXContent /></AddContext>,\n};\n".trim();
// Use this rather than JSON.stringify because `Meta`'s attributes
// are already valid code strings, so we want to insert them raw
// rather than add an extra set of quotes
function stringifyMeta(meta) {
    var result = '{ ';
    Object.entries(meta).forEach(function (_a) {
        var key = _a[0], val = _a[1];
        if (val) {
            result += key + ": " + val + ", ";
        }
    });
    result += ' }';
    return result;
}
var hasStoryChild = function (node) {
    if (node.openingElement && node.openingElement.name.name === 'Story') {
        return node;
    }
    if (node.children && node.children.length > 0) {
        return node.children.find(function (child) { return hasStoryChild(child); });
    }
    return null;
};
function extractExports(node, options) {
    node.children.forEach(function (child) {
        if (child.type === 'jsx') {
            try {
                var ast = parser.parseExpression(child.value, { plugins: ['jsx'] });
                if (ast.openingElement &&
                    ast.openingElement.type === 'JSXOpeningElement' &&
                    ast.openingElement.name.name === 'Preview' &&
                    !hasStoryChild(ast)) {
                    var previewAst = ast.openingElement;
                    previewAst.attributes.push({
                        type: 'JSXAttribute',
                        name: {
                            type: 'JSXIdentifier',
                            name: 'mdxSource',
                        },
                        value: {
                            type: 'StringLiteral',
                            value: encodeURI(ast.children
                                .map(function (el) {
                                return generate(el, {
                                    quotes: 'double',
                                }).code;
                            })
                                .join('\n')),
                        },
                    });
                }
                var code = generate(ast, {}).code;
                // eslint-disable-next-line no-param-reassign
                child.value = code;
            }
            catch (_a) {
                /** catch erroneous child.value string where the babel parseExpression makes exception
                 * https://github.com/mdx-js/mdx/issues/767
                 * eg <button>
                 *      <div>hello world</div>
                 *
                 *    </button>
                 * generates error
                 * 1. child.value =`<button>\n  <div>hello world</div`
                 * 2. child.value =`\n`
                 * 3. child.value =`</button>`
                 *
                 */
            }
        }
    });
    // we're overriding default export
    var defaultJsx = mdxToJsx.toJSX(node, {}, __assign(__assign({}, options), { skipExport: true }));
    var storyExports = [];
    var includeStories = [];
    var metaExport = null;
    var context = {
        counter: 0,
        storyNameToKey: {},
    };
    node.children.forEach(function (n) {
        var exports = getExports(n, context, options);
        if (exports) {
            var stories = exports.stories, meta = exports.meta;
            if (stories) {
                Object.entries(stories).forEach(function (_a) {
                    var key = _a[0], story = _a[1];
                    includeStories.push(key);
                    storyExports.push(story);
                });
            }
            if (meta) {
                if (metaExport) {
                    throw new Error('Meta can only be declared once');
                }
                metaExport = meta;
            }
        }
    });
    if (metaExport) {
        if (!storyExports.length) {
            storyExports.push('export const __page = () => { throw new Error("Docs-only story"); };');
            storyExports.push('__page.story = { parameters: { docsOnly: true } };');
            includeStories.push('__page');
        }
    }
    else {
        metaExport = {};
    }
    metaExport.includeStories = JSON.stringify(includeStories);
    var fullJsx = __spreadArrays([
        'import { assertIsFn, AddContext } from "cl-sb-docs/blocks";',
        defaultJsx
    ], storyExports, [
        "const componentMeta = " + stringifyMeta(metaExport) + ";",
        "const mdxStoryNameToKey = " + JSON.stringify(context.storyNameToKey) + ";",
        wrapperJs,
        'export default componentMeta;',
    ]).join('\n\n');
    return fullJsx;
}
function createCompiler(mdxOptions) {
    return function compiler(options) {
        if (options === void 0) { options = {}; }
        this.Compiler = function (tree) { return extractExports(tree, options, mdxOptions); };
    };
}
module.exports = createCompiler;
