// Global Variables
let currentStudentName = '';
let currentLessonIndex = 0;
let mediaRecorder = null;
let recordingStartTime = null;
let recordingTimer = null;
let audioContext = null;
let recordedChunks = [];

// Quran Lessons Data (6 Surahs with waqaf marks)
const lessons = [
    {
        id: 1,
        surah: "Al-Fatihah",
        surahArabic: "الفاتحة",
        verse: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۚ",
        audioUrl: "/audio/al-fatihah-1.mp3",
        waqafMarks: [
            { position: 34, type: "mandatory", symbol: "۔" }
        ]
    },
    {
        id: 2,
        surah: "Al-Ikhlas",
        surahArabic: "الإخلاص",
        verse: 1,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۚ",
        audioUrl: "/audio/al-ikhlas-1.mp3",
        waqafMarks: [
            { position: 18, type: "mandatory", symbol: "۔" }
        ]
    },
    {
        id: 3,
        surah: "An-Nas",
        surahArabic: "الناس",
        verse: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۚ",
        audioUrl: "/audio/an-nas-1.mp3",
        waqafMarks: [
            { position: 23, type: "mandatory", symbol: "۔" }
        ]
    },
    {
        id: 4,
        surah: "Al-Falaq",
        surahArabic: "الفلق",
        verse: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۚ",
        audioUrl: "/audio/al-falaq-1.mp3",
        waqafMarks: [
            { position: 23, type: "mandatory", symbol: "۔" }
        ]
    },
    {
        id: 5,
        surah: "Al-Kafiroon",
        surahArabic: "الكافرون",
        verse: 1,
        text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۚ",
        audioUrl: "/audio/al-kafiroon-1.mp3",
        waqafMarks: [
            { position: 27, type: "mandatory", symbol: "۔" }
        ]
    },
    {
        id: 6,
        surah: "Al-Asr",
        surahArabic: "العصر",
        verse: 1,
        text: "وَالْعَصْرِ ۚ",
        audioUrl: "/audio/al-asr-1.mp3",
        waqafMarks: [
            { position: 12, type: "mandatory", symbol: "۔" }
        ]
    }
];

// Initialize App
function initApp() {
    setupAudioContext();
    initializeThreeJS();
    setupEventListeners();
    loadLesson(0);
}

// Setup Audio Context
function setupAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Initialize Three.js 3D Avatar
function initializeThreeJS() {
    const canvas3d = document.getElementById('canvas3d');
    const width = canvas3d.clientWidth;
    const height = canvas3d.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setClearColor(0x87ceeb, 1);
    canvas3d.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create Avatar (Simple 3D Figure)
    const avatar = createAvatar();
    scene.add(avatar);
    avatar.position.z = -5;

    camera.position.z = 5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        avatar.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = canvas3d.clientWidth;
        const newHeight = canvas3d.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    window.renderer = renderer;
    window.scene = scene;
    window.avatar = avatar;
}

// Create 3D Avatar (Simple Sphere Head + Body)
function createAvatar() {
    const group = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8;
    group.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.1, 0.4);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.1, 0.4);
    group.add(rightEye);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.4, 1, 0.3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4169e1 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    group.add(body);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 0.3, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 0.3, 0);
    group.add(rightArm);

    return group;
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('playAudioBtn').addEventListener('click', playAudio);
}

// Start Game
function startGame() {
    const nameInput = document.getElementById('studentName');
    if (nameInput.value.trim() === '') {
        alert('Sila masukkan nama anda!');
        return;
    }

    currentStudentName = nameInput.value.trim();
    document.getElementById('displayName').textContent = currentStudentName;

    document.getElementById('nameInputScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
}

// Load Lesson
function loadLesson(index) {
    if (index < 0 || index >= lessons.length) return;

    currentLessonIndex = index;
    const lesson = lessons[index];

    document.getElementById('surahName').textContent = lesson.surah;
    document.getElementById('verseNumber').textContent = `Ayat ${lesson.verse}`;
    document.getElementById('quranText').textContent = lesson.text;
    document.getElementById('lessonCounter').textContent = `${index + 1} / ${lessons.length}`;

    // Store current audio URL
    window.currentAudioUrl = lesson.audioUrl;
}

// Play Audio
function playAudio() {
    const audio = new Audio(window.currentAudioUrl);
    const statusEl = document.getElementById('audioStatus');

    audio.onplay = () => {
        statusEl.textContent = '🔊 Sedang bermain...';
        document.getElementById('playAudioBtn').disabled = true;
    };

    audio.onended = () => {
        statusEl.textContent = '✓ Selesai';
        document.getElementById('playAudioBtn').disabled = false;
    };

    audio.onerror = () => {
        statusEl.textContent = '❌ Ralat memuat audio';
        document.getElementById('playAudioBtn').disabled = false;
    };

    audio.play().catch(err => {
        statusEl.textContent = '❌ Ralat bermain audio';
        console.error('Audio play error:', err);
    });
}

// Start Recording
function startRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') return;

    recordedChunks = [];
    recordingStartTime = Date.now();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                recordedChunks.push(e.data);
            };

            mediaRecorder.onstart = () => {
                document.getElementById('recordingStatus').textContent = '🔴 Merekod...';
                document.getElementById('recordBtn').textContent = '🎤 Merekod... Tahan untuk melanjutkan';
                startRecordingTimer();
            };

            mediaRecorder.start();
        })
        .catch(err => {
            alert('Tidak dapat akses mikrofon. Sila berikan kebenaran!');
            console.error('Microphone access error:', err);
        });
}

// Stop Recording
function stopRecording() {
    if (!mediaRecorder || mediaRecorder.state !== 'recording') return;

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        
        document.getElementById('recordingStatus').textContent = '✓ Rakaman disimpan!';
        document.getElementById('recordBtn').textContent = '🎤 Tekan & Tahan untuk Rekod';
        
        stopRecordingTimer();
        saveRecording(blob);

        // Stop all audio tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.stop();
}

// Start Recording Timer
function startRecordingTimer() {
    let seconds = 0;
    recordingTimer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('recordingTime').textContent = 
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

// Stop Recording Timer
function stopRecordingTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
        document.getElementById('recordingTime').textContent = '00:00';
    }
}

// Save Recording
async function saveRecording(audioBlob) {
    const formData = new FormData();
    formData.append('studentName', currentStudentName);
    formData.append('surah', lessons[currentLessonIndex].surah);
    formData.append('verse', lessons[currentLessonIndex].verse);
    formData.append('audio', audioBlob, `${currentStudentName}-recording.webm`);
    formData.append('timestamp', new Date().toISOString());

    try {
        const response = await fetch('/api/recordings/save', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Rakaman tersimpan dengan jayanya!');
        } else {
            console.error('Ralat menyimpan rakaman');
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

// Previous Lesson
function previousLesson() {
    if (currentLessonIndex > 0) {
        loadLesson(currentLessonIndex - 1);
    }
}

// Next Lesson
function nextLesson() {
    if (currentLessonIndex < lessons.length - 1) {
        loadLesson(currentLessonIndex + 1);
    }
}

// Admin Login
async function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === '') {
        alert('Sila masukkan kata laluan!');
        return;
    }

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (response.ok) {
            document.getElementById('adminLogin').classList.add('hidden');
            document.getElementById('adminPanel').classList.remove('hidden');
            loadRecordings();
        } else {
            alert('Kata laluan salah!');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

// Load Recordings
async function loadRecordings() {
    try {
        const response = await fetch('/api/admin/recordings');
        const recordings = await response.json();

        const list = document.getElementById('recordingsList');
        list.innerHTML = '';

        recordings.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recording-item';
            item.innerHTML = `
                <h4>👤 ${rec.studentName}</h4>
                <p>📖 ${rec.surah} - Ayat ${rec.verse}</p>
                <p>⏰ ${new Date(rec.timestamp).toLocaleString('ms-MY')}</p>
                <audio controls>
                    <source src="/recordings/${rec.audioFile}" type="audio/webm">
                    Browser anda tidak menyokong audio.
                </audio>
            `;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Load recordings error:', error);
    }
}

// Logout Admin
function logoutAdmin() {
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminPassword').value = '';
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initApp);
