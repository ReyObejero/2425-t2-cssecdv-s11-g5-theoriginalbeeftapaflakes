"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeStringToMilliseconds = void 0;
/**
 * Converts a time string into milliseconds.
 *
 * @remarks
 * The time string should consist of one or more time units and their respective values. This function supports
 * milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), and days (`d`). It returns `0` if the input string
 * is not in a recognized format.
 *
 * @example
 * ```
 * import { timeStringToMilliseconds } from '/path/to/parse-time';
 *
 * console.log(timeStringToMilliseconds('1m30s'));
 * // Evaluates to 90,000 milliseconds
 * console.log(timeStringToMilliseconds('30d 24h'));
 * // Evaluates to 2,678,400,000 milliseconds
 * ```
 *
 * @param timeString - A string representing a duration with time units. Each unit should have an accompanying time value.
 * @returns The total duration in milliseconds, or `0` if the format is incorrect.
 */
const timeStringToMilliseconds = (timeString) => {
    var _a, _b;
    return ((_b = (_a = timeString.match(/\d+\s?\w/g)) === null || _a === void 0 ? void 0 : _a.reduce((accumulator, currentValue) => {
        const unit = currentValue.trim().slice(-1);
        let multipler = 1;
        if (unit == 'ms') {
            multipler *= 1;
        }
        if (unit == 's') {
            multipler *= 1000;
        }
        if (unit == 'm') {
            multipler *= 1000 * 60;
        }
        if (unit == 'h') {
            multipler *= 1000 * 60 * 60;
        }
        if (unit == 'd') {
            multipler *= 1000 * 60 * 60 * 24;
        }
        return accumulator + parseInt(currentValue, 10) * multipler;
    }, 0)) !== null && _b !== void 0 ? _b : 0);
};
exports.timeStringToMilliseconds = timeStringToMilliseconds;
//# sourceMappingURL=parse-time.js.map