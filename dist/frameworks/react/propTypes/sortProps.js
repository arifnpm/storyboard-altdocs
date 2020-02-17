"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
// react-docgen doesn't returned the props in the order they were defined in the "propTypes" object of the component.
// This function re-order them by their original definition order.
function keepOriginalDefinitionOrder(extractedProps, component) {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    var propTypes = component.propTypes;
    if (!lodash_1.isNil(propTypes)) {
        return Object.keys(propTypes)
            .map(function (x) { return extractedProps.find(function (y) { return y.name === x; }); })
            .filter(function (x) { return x; });
    }
    return extractedProps;
}
exports.keepOriginalDefinitionOrder = keepOriginalDefinitionOrder;
