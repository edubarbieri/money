module.exports = {
  apps : [{
    name: 'MeuDinheiro backend api',
    script: './src/index.js',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
