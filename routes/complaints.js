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
// GET ALL COMPLAINTS (warden)
router.get('/all', async (req, res) => {

  if (!req.session || !req.session.user) {
    return res.json({ success: false, message: 'Please login first' })
  }

  if (req.session.user.role !== 'warden' && req.session.user.role !== 'admin') {
    return res.json({ success: false, message: 'Access denied' })
  }

  try {
    const [complaints] = await db.promise().query(
      `SELECT complaints.*, users.name as student_name, users.room_number 
       FROM complaints 
       JOIN users ON complaints.student_id = users.id 
       ORDER BY complaints.created_at DESC`
    )

    res.json({ success: true, complaints })

  } catch (err) {
    console.log('Get all complaints error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})

// UPDATE COMPLAINT STATUS (warden)
router.put('/:id/status', async (req, res) => {

  if (!req.session || !req.session.user) {
    return res.json({ success: false, message: 'Please login first' })
  }

  if (req.session.user.role !== 'warden' && req.session.user.role !== 'admin') {
    return res.json({ success: false, message: 'Access denied' })
  }

  const { id } = req.params
  const { status } = req.body

  if (!['pending', 'in_progress', 'resolved'].includes(status)) {
    return res.json({ success: false, message: 'Invalid status' })
  }

  try {
    await db.promise().query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      [status, id]
    )

    res.json({ success: true, message: 'Status updated successfully!' })

  } catch (err) {
    console.log('Update status error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})

// ADMIN STATS
router.get('/stats', async (req, res) => {

  if (!req.session || !req.session.user) {
    return res.json({ success: false, message: 'Please login first' })
  }

  if (req.session.user.role !== 'admin') {
    return res.json({ success: false, message: 'Access denied' })
  }

  try {
    const [[total]] = await db.promise().query(
      'SELECT COUNT(*) as total FROM complaints'
    )
    const [[pending]] = await db.promise().query(
      'SELECT COUNT(*) as pending FROM complaints WHERE status = ?', ['pending']
    )
    const [[in_progress]] = await db.promise().query(
      'SELECT COUNT(*) as in_progress FROM complaints WHERE status = ?', ['in_progress']
    )
    const [[resolved]] = await db.promise().query(
      'SELECT COUNT(*) as resolved FROM complaints WHERE status = ?', ['resolved']
    )

    res.json({
      success: true,
      stats: {
        total: total.total,
        pending: pending.pending,
        in_progress: in_progress.in_progress,
        resolved: resolved.resolved
      }
    })

  } catch (err) {
    console.log('Stats error:', err)
    res.json({ success: false, message: 'Something went wrong' })
  }
})
module.exports = router