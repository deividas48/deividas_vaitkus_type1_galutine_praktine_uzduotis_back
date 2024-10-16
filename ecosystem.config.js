// ecosystem.config.js
// The ecosystem.config.js file for PM2 helps manage environment variables by
// specifying which environment settings to use when running your application
//  Instead, it sets environment variables, such as NODE_ENV=production

module.exports = {
  apps: [
    {
      name: 'teikas-backend-api', // random name
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000, // Set other variables as needed
      },
    },
  ],
};
