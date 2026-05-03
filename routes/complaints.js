const express = require('express')
const router = express.Router()
const db = require('../db/connect')

// SUBMIT COMPLAINT
router.post('/', async (req, res) => {

  // Check if logged in FIRST
  if (!req.session || !req.session.user) {
    return res.json({ success: false, message: 'Please login first' })
  }

  const { type, description } = req.body

  // Check fields
  if (!type || !description) {
    return res.json({ success: false, message: 'All fields are required' })
  }

  try {
    const student_id = req.session.user.id

    await db.promise().query(
      'INSERT INTO complaints (student_id, type, description, status) VALUES (?, ?, ?, ?)',
      [student_id, type, description, 'pending']
    )

    res.json({ success: true, message: 'Complaint submitted successfully!' })

  } catch (err) {
    console.log('Complaint error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})

// GET MY COMPLAINTS
router.get('/my-complaints', async (req, res) => {

  // Check if logged in
  if (!req.session.user) {
    return res.json({ success: false, message: 'Please login first' })
  }

  try {
    const student_id = req.session.user.id

    const [complaints] = await db.promise().query(
      'SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC',
      [student_id]
    )

    res.json({ success: true, complaints })

  } catch (err) {
    console.log('Get complaints error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})

module.exports = router