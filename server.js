const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic routes
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