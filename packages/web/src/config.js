
const isEnvProduction = process.env.NODE_ENV === 'production';
export default {
  apiUrl : isEnvProduction ? 'https://meudinheiro-edubarbieri.herokuapp.com' : 'http://localhost:3003',
  cryptKey: 'T3st4nD0',
  mobileResize: 1224,
  defaultAvatar: '/img/user.png'
};
