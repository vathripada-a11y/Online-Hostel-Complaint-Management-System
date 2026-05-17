const mysql = require('mysql2')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hostel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

db.getConnection((err, connection) => {
  if (err) {
    console.log('Database connection failed:', err)
    return
  }
  console.log('Connected to MySQL database!')
  connection.release()
})

module.exports = db