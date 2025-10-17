const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(process.env.DATABASE_URL);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Appointment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service VARCHAR(255),
    date VARCHAR(50),
    time VARCHAR(50),
    carType VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to Railway MySQL!');
  
  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('✅ Table "appointment" created successfully!');
    }
    connection.end();
  });
});