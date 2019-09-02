
// @ts-ignore
import bundle from './resources/bundle';
import translator from './service';

/**
 * Translated message and replaced tags {n} with index of ...args foreach
 * @param {string} key 
 * @param {any[]} args
 * @returns {string} formatted messa
 */
export const bundleFormat = (key, ...args) => {
    let message = translator(bundle, key);
    message = messageFormat(message, ...args);
    return message;
}

/**
 * Load bundle by key and lang.
 * @param {string} key
 * @param {string} [lang]
 * @returns {string} message
 */
export default (key, lang) => {
    return translator(bundle, key, lang);
};

/**
 * Format message with params.
 * @param {string} message
 * @param {string[]} args
 * @returns {string} message
 */
export const messageFormat = (message, ...args) => {
    if (args && args.length) {
        for (let idx = 0; idx < args.length; idx++) {
            const arg = args[idx];
            message = message.replace(`{${idx}}`, arg);
        }
    }
    return message;
}
