const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : '123456',
  database : 'my_db'
});

//create connection
connection.connect(function(err){
  if(err){
    console.error('Error connecting to Db', err);
    return;
  }
  console.log('DBConnection established');
});


connection.end();

module.exports = connection;
