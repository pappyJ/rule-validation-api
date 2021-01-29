//importing the modules

const dotenv = require('dotenv');

//setiting the path for enviromental variables

dotenv.config({ path: './config/config.env' });

//importing the constants module

const { PORT } = require('./config/config');

//importing the app to the server file

const app = require('./app');

//catching uncaught errors

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);

  console.log('UNCAUGHT EXCEPTOIN! Shutting Down');

  process.exit(1);
});

//end of third party and custon initialisations

//creating the variable for the port

const server = app.listen(PORT, () => {
  console.log(`Listening To Requests On Port ${PORT}....`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  console.log('❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNHANDLED REJECTION ERROR ⬇⬇⬇');

  server.close(() => {
    process.exit(1);
  });
});

//RESPONDING TO HEROKU SIGTERM

process.on('SIGTERM', () => {
  _logger.log('info', 'SIGTERM Recieved Shutting Down Gracefuly!!!');

  server.close(() => {
    _logger.log('info', 'Process Terminated');
  });
});
