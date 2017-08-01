const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : '',
  database : 'chattagong'
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
