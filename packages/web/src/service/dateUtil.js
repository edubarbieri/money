import { toPattern } from 'vanilla-masker';
import moment from 'moment';
import bundle from 'i18n/bundle'

 /**
 * @param {string | number} date
 * @param {undefined} [mask]
 * @return {string} formattedDate
 */
export const formatDate = (date, mask) => {
    return toPattern(date, mask || bundle('date.mask'));
}

 /**
 * @param {moment.MomentInput | Date} [date] 
 * @param {string} [pattern]
 * @return {string} formattedDate
 */
export const getHumanDate = (date, pattern) => {
    return moment(date).format(pattern || bundle('moment.date.format'));
}

 /**
 * @param {moment.MomentInput | Date} date
 * @param {undefined} [pattern]
 * @return {moment.Moment} date
 */
export const getParsedDate = (date, pattern) => {
    return moment(date, pattern || bundle('moment.date.format'));
}