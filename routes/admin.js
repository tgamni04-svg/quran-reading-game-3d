const express = require('express');
const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Store admin sessions
let adminSessions = new Set();

// Admin login
router.post('/login', (req, res) => {
    const { password } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const sessionId = Math.random().toString(36).substring(7);
    adminSessions.add(sessionId);

    res.json({
        success: true,
        sessionId
    });
});

// Middleware to check admin access
const checkAdminAccess = (req, res, next) => {
    const { sessionId } = req.query;
    
    if (!sessionId || !adminSessions.has(sessionId)) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    next();
};

// Get all recordings (admin only)
router.get('/recordings', checkAdminAccess, (req, res) => {
    // Get from recordings route
    const recordingsMetadata = []; // This should come from database
    res.json(recordingsMetadata);
});

// Get student recordings
router.get('/student/:name', checkAdminAccess, (req, res) => {
    const { name } = req.params;
    // Query database for student recordings
    res.json([]);
});

// Admin logout
router.post('/logout', (req, res) => {
    const { sessionId } = req.body;
    adminSessions.delete(sessionId);
    res.json({ success: true });
});

module.exports = router;
