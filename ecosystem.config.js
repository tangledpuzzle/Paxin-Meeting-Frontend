module.exports = {
  apps: [
    {
      name: 'paxintrade-frontend',
      exec_mode: 'cluster',
      instances: 2, // 'max' or a number of instances
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: "10s",
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
    },
  ],
};
