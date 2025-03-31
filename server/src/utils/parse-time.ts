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
export const timeStringToMilliseconds = (timeString: string): number => {
    return (
        timeString.match(/\d+\s?\w/g)?.reduce((accumulator, currentValue) => {
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
        }, 0) ?? 0
    );
};
