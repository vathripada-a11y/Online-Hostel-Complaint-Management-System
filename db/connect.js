const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hostel_db'
})

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err)
    return
  }
  console.log('Connected to MySQL database!')
})

module.exports = db