import {
    faCar,
    faPiggyBank,
    faHome,
    faTasks,
    faMobileAlt,
    faDesktop,
    faMapMarkedAlt,
    faUserMd,
    faBriefcase,
    faUniversity
} from '@fortawesome/free-solid-svg-icons';
import { bundle } from 'i18n/bundle';

export const getPlanIcon = type => {
    switch (type) {
        case 'car':
            return faCar;
        case 'travel':
            return faMapMarkedAlt;
        case 'savings':
            return faPiggyBank;
        case 'ownHome':
            return faHome;
        case 'ownBusiness':
            return faBriefcase;
        case 'phone':
            return faMobileAlt;
        case 'eletronic':
            return faDesktop;
        case 'cirurgy':
            return faUserMd;
        case 'study':
            return faUniversity;
        default:
            return faTasks;
    }
};

export const getIconTypes = [
    {name: bundle('other'), value: ''},
    {name: bundle('car'), value: 'car'},
    {name: bundle('cirurgy'), value: 'cirurgy'},
    {name: bundle('eletronic'), value: 'eletronic'},
    {name: bundle('ownBusiness'), value: 'ownBusiness'},
    {name: bundle('ownHome'), value: 'ownHome'},
    {name: bundle('phone'), value: 'phone'},
    {name: bundle('savings'), value: 'savings'},
    {name: bundle('study'), value: 'study'},
    {name: bundle('travel'), value: 'travel'},
]

export default faTasks;
