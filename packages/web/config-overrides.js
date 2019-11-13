const rewireYAML = require('react-app-rewire-yaml');
const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');
const {rewireWorkboxGenerate} = require('react-app-rewire-workbox');
const path = require('path');

module.exports = function override(config, env) {
    config = rewireYAML(config, env);
    config = rewireAliases.aliasesOptions({
        reducers: path.resolve(__dirname, `${paths.appSrc}/reducers/`),
        config: path.resolve(__dirname, `${paths.appSrc}/config/`),
        services: path.resolve(__dirname, `${paths.appSrc}/services/`),
        style: path.resolve(__dirname, `${paths.appSrc}/style/`),
        pages: path.resolve(__dirname, `${paths.appSrc}/pages/`),
        components: path.resolve(__dirname, `${paths.appSrc}/components/`),
        i18n: path.resolve(__dirname, `${paths.appSrc}/i18n/`)
	})(config, env);
	
    if (env === 'production') {
		console.log('Production build - Adding Workbox for PWAs teste');
		const configSW = {
			cacheId: 'money',
			skipWaiting: true
		}
        config = rewireWorkboxGenerate(configSW)(config, env);
    }
    return config;
};
