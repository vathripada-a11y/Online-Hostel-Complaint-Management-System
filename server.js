const express = require('express')
const app = express()
const session = require('express-session')
const db = require('./db/connect')
const authRoutes = require('./routes/auth')
const complaintRoutes = require('./routes/complaints')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'hostel123',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    secure: false
  }
}))

app.use('/api', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use(express.static('frontend'))

app.get('/', (req, res) => {
  res.send('Hostel Complaint System is running!')
})

app.get('/student', (req, res) => {
  res.send('Welcome Student!')
})

app.get('/warden', (req, res) => {
  res.send('Welcome Warden!')
})

app.get('/admin', (req, res) => {
  res.send('Welcome Admin!')
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})