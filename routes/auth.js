const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../db/connect')

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, room_number } = req.body

  // Check all fields are filled
  if (!name || !email || !password || !room_number) {
    return res.json({ success: false, message: 'All fields are required' })
  }

  try {
    // Check if email already exists
    const [existing] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?', [email]
    )

    if (existing.length > 0) {
      return res.json({ success: false, message: 'Email already registered' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save to database
    await db.promise().query(
      'INSERT INTO users (name, email, password, role, room_number) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'student', room_number]
    )

    res.json({ success: true, message: 'Registration successful!' })

  } catch (err) {
    console.log('Register error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})
// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Check fields are filled
  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' })
  }

  try {
    // Find user by email
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?', [email]
    )

    // If no user found
    if (users.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' })
    }

    const user = users[0]

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.json({ success: false, message: 'Invalid email or password' })
    }

    // Create session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    res.json({
      success: true,
      message: 'Login successful!',
      role: user.role,
      name: user.name
    })

  } catch (err) {
    console.log('Login error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true, message: 'Logged out successfully!' })
})
module.exports = router