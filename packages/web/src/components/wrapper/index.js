import MobileWrapper from './Mobile';
import DesktopWrapper from './Desktop';
import IfWrapper from './If';

export const Desktop = DesktopWrapper;
export const Mobile = MobileWrapper;
export const If = IfWrapper;
export default {
    Desktop: DesktopWrapper,
    Mobile: MobileWrapper,
    If: IfWrapper,
}