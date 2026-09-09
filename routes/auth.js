const express = require('express');
const router = express.Router();

// Student login (just name entry)
router.post('/login', (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }

    // Store in session
    req.session.studentName = name;

    res.json({
        success: true,
        studentName: name
    });
});

module.exports = router;
