import {configure} from 'mymoney-sdk';
import config from './config'

export const init = () => {
    configure({endpoint: config.apiUrl});
}