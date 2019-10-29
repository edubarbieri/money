// @ts-ignore
import languages from './resources/languages';
import { reidrated } from 'store/store';

let defaultLang = 'en-US';

/**
 * @param {string} lang
 */
const checkAlias = (lang) => {
    const alias = languages.alias[lang];
    return (alias) ? alias : lang;
}

/**
 * @param {string} lang
 */
const checkLang = (lang) => {
    const alias = checkAlias(lang);
    const checkedLang = languages.languages.includes(alias);
    return (checkedLang) ? alias : defaultLang;
}

const getBrowserLang = () => {
    reidrated.then((res) => {
        let browserLanguage = window.navigator.language || defaultLang;
        if (!browserLanguage) {
            browserLanguage = defaultLang;
        }
        let activeLang = checkLang(browserLanguage);
        if(res.user && res.user.prefferedLang){
            activeLang = res.user.prefferedLang;
        }
        return defaultLang = activeLang
    })
}

/**
 * @param {string} lang
 */
const setLang = (lang) => {
    const activeLang = checkLang(lang);
    defaultLang = checkLang(activeLang);
}

/**
 * @param {{ [x: string]: string; }} bundle
 * @param {string} key
 * @param {string} [lang]
 */
const translate = (bundle, key, lang) => {
    const message = bundle[key];
    if (message) {
        return (lang) ? message[checkLang(lang)] : message[defaultLang];
    }
    return key;
}

getBrowserLang();
export default translate;
export const LANGUAGES = languages;
export const SetLang = setLang;
export const BROWSER_LANG = getBrowserLang();
export const LANG = defaultLang;