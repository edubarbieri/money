import {toMoney} from 'vanilla-masker';
// @ts-ignore
import config from '../config'
import bundle from 'i18n/bundle';
import moment from 'moment';

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


const _currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});
/**
	* Format number to  currency format like R$ 123.456,00
 * @param {number} value
 * @returns {string} formattedValue like R$ 123.456,00
 */
export const formatCurrency = (value) => {
	return _currencyFormatter.format(value);
}


export const formatDate = (date) => {
	console.log(date)
	if((typeof date === 'string') && date.length === 10){
		return date.split('-').reverse().join('/');
	}
	return moment(date).format('DD/MM/YYYY')
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

export const toogleActiveClass = (elem) =>{
    if(!elem){
        return;
    }
    if(elem.classList.contains('active')){
        elem.classList.remove('active')
        return;
    }
    elem.classList.add('active')
}