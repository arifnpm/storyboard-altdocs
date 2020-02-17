"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_TYPE_SUMMARY_LENGTH = 90;
exports.MAX_DEFALUT_VALUE_SUMMARY_LENGTH = 50;
function isTooLongForTypeSummary(value) {
    return value.length > exports.MAX_TYPE_SUMMARY_LENGTH;
}
exports.isTooLongForTypeSummary = isTooLongForTypeSummary;
function isTooLongForDefaultValueSummary(value) {
    return value.length > exports.MAX_DEFALUT_VALUE_SUMMARY_LENGTH;
}
exports.isTooLongForDefaultValueSummary = isTooLongForDefaultValueSummary;
function createSummaryValue(summary, detail) {
    return { summary: summary, detail: detail };
}
exports.createSummaryValue = createSummaryValue;
