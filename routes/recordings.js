const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/recordings');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const studentName = req.body.studentName.replace(/\s+/g, '-');
        cb(null, `${studentName}-${timestamp}.webm`);
    }
});

const upload = multer({ storage });

// In-memory storage for recordings metadata
let recordingsMetadata = [];

// Save recording
router.post('/save', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { studentName, surah, verse, timestamp } = req.body;

    const recordingData = {
        id: recordingsMetadata.length + 1,
        studentName,
        surah,
        verse,
        audioFile: req.file.filename,
        timestamp: timestamp || new Date().toISOString(),
        fileSize: req.file.size
    };

    recordingsMetadata.push(recordingData);

    // TODO: Save to MongoDB instead of memory
    console.log('Recording saved:', recordingData);

    res.json({
        success: true,
        message: 'Recording saved successfully',
        data: recordingData
    });
});

// Get all recordings (for admin)
router.get('/admin/all', (req, res) => {
    res.json(recordingsMetadata);
});

// Get recordings by student name
router.get('/student/:name', (req, res) => {
    const { name } = req.params;
    const filtered = recordingsMetadata.filter(r => 
        r.studentName.toLowerCase() === name.toLowerCase()
    );
    res.json(filtered);
});

// Delete recording (admin only)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = recordingsMetadata.findIndex(r => r.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Recording not found' });
    }

    const recording = recordingsMetadata[index];
    const filePath = path.join(uploadDir, recording.audioFile);

    // Delete file
    fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
    });

    recordingsMetadata.splice(index, 1);
    res.json({ success: true, message: 'Recording deleted' });
});

module.exports = router;
