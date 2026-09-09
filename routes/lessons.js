const express = require('express');
const router = express.Router();

// Get all lessons
router.get('/', (req, res) => {
    const lessons = [
        {
            id: 1,
            surah: "Al-Fatihah",
            surahArabic: "الفاتحة",
            verse: 1,
            text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۚ",
            audioUrl: "/audio/al-fatihah-1.mp3"
        },
        {
            id: 2,
            surah: "Al-Ikhlas",
            surahArabic: "الإخلاص",
            verse: 1,
            text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۚ",
            audioUrl: "/audio/al-ikhlas-1.mp3"
        },
        {
            id: 3,
            surah: "An-Nas",
            surahArabic: "الناس",
            verse: 1,
            text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۚ",
            audioUrl: "/audio/an-nas-1.mp3"
        },
        {
            id: 4,
            surah: "Al-Falaq",
            surahArabic: "الفلق",
            verse: 1,
            text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۚ",
            audioUrl: "/audio/al-falaq-1.mp3"
        },
        {
            id: 5,
            surah: "Al-Kafiroon",
            surahArabic: "الكافرون",
            verse: 1,
            text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۚ",
            audioUrl: "/audio/al-kafiroon-1.mp3"
        },
        {
            id: 6,
            surah: "Al-Asr",
            surahArabic: "العصر",
            verse: 1,
            text: "وَالْعَصْرِ ۚ",
            audioUrl: "/audio/al-asr-1.mp3"
        }
    ];

    res.json(lessons);
});

// Get specific lesson
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Get from database or array
    res.json({ id, lesson: 'data' });
});

module.exports = router;
