// @ts-ignore
import route from './resources/route';
import translator from './service';

/**
 * Load route by key and lang.
 * @param {string} key
 * @param {string} [lang]
 * @returns {string} message
 */
export default (key, lang) => {
    return translator(route, key, lang);
};