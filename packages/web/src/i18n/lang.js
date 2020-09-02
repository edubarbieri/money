import { bundle } from "./bundle";
import { Rehydratated, Store } from 'reducers/index';

const defaultLanguage = 'pt-BR';

let lang = defaultLanguage;

const getLang = () => {
    return lang;
};

const getRegisteredLanges = () => [
    {lang: 'pt-BR', name: bundle('pt-BR')},
    {lang: 'en-US', name: bundle('en-US')}
];

Rehydratated.then(() => {
    const state = Store.getState()
    lang = state.user.lang;
});
 
export {
    getLang,
    getRegisteredLanges
}