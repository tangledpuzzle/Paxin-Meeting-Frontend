module.exports = {
  apps: [
    {
      name: 'paxintrade-frontend',
      exec_mode: 'cluster',
      instances: 2, // 'max' or a number of instances
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
      max_restarts: 5,
      min_uptime: '5s',
      script: 'server.js',
      env: {
        PORT: 3000,
        HOSTNAME: 'localhost',
      },
    },
  ],
};
