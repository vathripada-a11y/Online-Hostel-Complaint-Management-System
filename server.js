const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let complaints = []; // temporary storage

// LOGIN API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        res.json({ success: true, userId: 1 });
    } else {
        res.json({ success: false });
    }
});

// SUBMIT COMPLAINT
app.post("/submit-complaint", (req, res) => {
    const { title, description, userId } = req.body;

    const newComplaint = {
        id: complaints.length + 1,
        title,
        description,
        userId,
        status: "pending"
    };

    complaints.push(newComplaint);

    res.json({ message: "Complaint added" });
});

// GET MY COMPLAINTS
app.get("/my-complaints", (req, res) => {
    const userId = req.query.userId;

    const userComplaints = complaints.filter(c => c.userId == userId);

    res.json(userComplaints);
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});