import { isMobile } from 'service/util';
import {useSelector} from 'react-redux';

const Desktop = ({ children }) => {
    let windowSize  = useSelector(state => state.global.width);
    return (!isMobile(windowSize)) ? children : null;
}

export default Desktop;
