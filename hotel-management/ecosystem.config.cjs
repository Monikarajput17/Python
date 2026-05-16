#!/bin/bash
# PM2 Ecosystem Configuration

module.exports = {
  apps: [
    {
      name: 'hotel-api',
      script: './dist/index.js',
      cwd: './server',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'hotel-client',
      script: 'npm',
      args: 'run preview',
      cwd: './client',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/client-error.log',
      out_file: './logs/client-out.log',
    },
    {
      name: 'hotel-admin',
      script: 'npm',
      args: 'run preview',
      cwd: './admin-panel',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/admin-error.log',
      out_file: './logs/admin-out.log',
    },
  ],
};
