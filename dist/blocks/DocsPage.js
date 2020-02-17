"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Title_1 = require("./Title");
var Subtitle_1 = require("./Subtitle");
var Description_1 = require("./Description");
var Primary_1 = require("./Primary");
var Props_1 = require("./Props");
var Stories_1 = require("./Stories");
exports.DocsPage = function (_a) {
    var titleSlot = _a.titleSlot, subtitleSlot = _a.subtitleSlot, descriptionSlot = _a.descriptionSlot, primarySlot = _a.primarySlot, propsSlot = _a.propsSlot, storiesSlot = _a.storiesSlot;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Title_1.Title, { slot: titleSlot }),
        react_1.default.createElement(Subtitle_1.Subtitle, { slot: subtitleSlot }),
        react_1.default.createElement(Description_1.Description, { slot: descriptionSlot }),
        react_1.default.createElement(Primary_1.Primary, { slot: primarySlot }),
        react_1.default.createElement(Props_1.Props, { slot: propsSlot }),
        react_1.default.createElement(Stories_1.Stories, { slot: storiesSlot })));
};
