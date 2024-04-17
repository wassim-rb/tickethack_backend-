const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://emmanuelayad:W4ZtLTlOabLhYpqw@myfirstdatabase.c1ehfew.mongodb.net/tickethack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
