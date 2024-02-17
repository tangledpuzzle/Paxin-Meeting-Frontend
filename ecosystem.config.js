module.exports = {
  apps: [
    {
      name: 'paxintrade-frontend',
      exec_mode: 'cluster',
      instances: 2, // 'max' or a number of instances
      autorestart: true,
      script: '.next/standalone/server.js',
      env: {
        PORT: 3000,
        HOSTNAME: 'localhost',
      },
    },
  ],
};
