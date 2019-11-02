// @ts-ignore
import resourcesBundle from './resources/bundle.yaml';
// @ts-ignore
import routesBundle from './resources/routes.yaml';

import { getLang } from 'i18n/lang';
import _ from 'lodash';
import { messageFormat } from 'services/Util';

const getMessage = (bundle, key, ...args) =>{
    if(!key){
        return '';
    }

    if(!bundle){
        return key;
    }
    const objectMessage = bundle[key];

    if(_.isEmpty(objectMessage)){
        return key;
    }

    const translatedMessage = objectMessage[getLang()];

    if(_.isEmpty(translatedMessage)){
        return key;
    }

    if(args && args.length){
        return messageFormat(translatedMessage, args);
    }
    return translatedMessage
}

const bundle = (key, ...args) => {return getMessage(resourcesBundle, key, args)}
const route = (key, ...args) => {return getMessage(routesBundle, key, args)}

export {
    bundle,
    route
}