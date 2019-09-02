import {toMoney} from 'vanilla-masker';
// @ts-ignore
import config from '../config'
import bundle from 'i18n/bundle';

 /**
 * Chek if is a valid email
 * @param {string} email
 * @returns boolean
 */
export const validateEmail = (email) => {
    return /^(([^<>().,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

/**
 * Chek if is a valid password
 * @param {string} password
 * @returns boolean
 */
export const validatePassword = (password) => {
    return password.match(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/);
}

 /**
  * Format number to  mask 123.456,00
 * @param {string} value
 * @returns {string} formattedValue like 123.456,00
 */
export const formatMoney = (value) => {
    return toMoney(value, {
        precision: 2,
        zeroCents: false
    });
}

 /**
  * Format number to  mask 123.456,00
 * @param {string} value
 * @returns {string} formattedValue like 123.456,00
 */
export const formatMoneyWithCurrency = (value) => {
    return bundle('currency') + ' ' +  toMoney(value, {
        precision: 2,
        zeroCents: false
    });
}

 /**
  * Check if is to render mobile content based on window.size
 * @param {number} [windowSize]
 * @return boolean
 */
export const isMobile = (windowSize) => {
    if(!windowSize){
        windowSize = window.innerWidth;
    }
    return windowSize <= config.mobileResize;
}

 /**
  * Check if firstParam is greater than second param;
  * @param {number} width the width to compare with the second
 * @param {number} [windowSize] use window.innerWidth if null
 * @return boolean
 */
export const checkSize = (width, windowSize) => {
    if(!windowSize){
        windowSize = window.innerWidth;
    }
    return width >= windowSize;
}