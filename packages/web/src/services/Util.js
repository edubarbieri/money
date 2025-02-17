// @ts-ignore
import config from 'config/general.yaml';
import {toMoney} from 'vanilla-masker';
import md5 from 'md5';
import { bundle } from 'i18n/bundle';


export const jsonQuerystringfy = (json, removeParams = []) => {
    return Object.keys(json).reduce(function (str, key, i) {
      var delimiter, val;
      delimiter = (i === 0) ? '?' : '&';
      key = encodeURIComponent(key);
      val = encodeURIComponent(json[key]);
      if(!val || removeParams.indexOf(key) > -1){
        return str;
      }
      return [str, delimiter, key, '=', val].join('');
    }, '');
}

export const messageFormat = (message, ...args) => {
  if (args && args.length) {
      for (let idx = 0; idx < args.length; idx++) {
          const arg = args[idx];
          message = message.replace(`{${idx}}`, arg);
      }
  }
  return message;
}

export const validateEmail = (email) => {
  return /^(([^<>().,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

export const validatePassword = (password) => {
  return password.match(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/);
}

export const getUserAvatar = (email) => {
  return messageFormat(config.gravatarUrl, md5(email));;
}

export const formatMoney = (value) => {
  return toMoney(value, {
      precision: 2,
      zeroCents: false
  });
}

export const formatCurrency = (value) => {
  return bundle('currency') + ' ' + formatMoney(value);
}

export const isMobile = (windowSize) => {
  if(!windowSize){
      windowSize = window.innerWidth;
  }
  return windowSize <= 767;
}


export const getUrlParameter = (name, url) => {
  if (!url) {
      url = window.location.href;
  }
  name = name.replace(/[[]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
  if (!results) {
      return null;
  }
  if (!results[2]) {
      return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
