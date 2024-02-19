module.exports = {
  apps: [
    {
      name: 'paxintrade-frontend',
      exec_mode: 'cluster',
      instances: 2, // 'max' or a number of instances
      autorestart: true,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        PORT: 3000,
        HOSTNAME: 'localhost',
      },
    },
  ],
};
